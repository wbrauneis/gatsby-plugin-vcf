const path = require("path")
const fsExtra = require("fs-extra")
const fs = require("fs")
const vCardJS = require("vcards-js")

const { defaultOptions, runQuery } = require("./internals")
const pluginOptionsSchema = require("./plugin-options")

const publicPath = `./public`

exports.pluginOptionsSchema = pluginOptionsSchema

exports.onPostBuild = async ({ graphql, reporter }, pluginOptions) => {
  const options = {
    ...defaultOptions,
    ...pluginOptions,
  }

  const baseQuery = await runQuery(graphql, options.query)

  if (!options.serialize || typeof options.serialize !== `function`) {
    reporter.warn(
      `You did not pass in a valid serialize function. Your vcards will not be generated.`
    )
  } else {
    const outputPath = path.join(publicPath, options.outputPath)
    if (!(await fsExtra.pathExists(outputPath))) {
      await fsExtra.mkdirp(outputPath)
    }

    const serializeResult = await options.serialize(baseQuery)

    serializeResult.forEach(person => {
      const personSocialUrls = person.socialUrls
      if (personSocialUrls) {
        delete person.socialUrls
      }

      let vcard = vCardJS()
      Object.assign(vcard, person)

      if (personSocialUrls) {
        for (const socialKey in personSocialUrls) {
          vcard.socialUrls[socialKey] = personSocialUrls[socialKey]
        }
      }
      // need to fix social links, see https://github.com/enesser/vCards-js/issues/45
      let vCardString = vcard.getFormattedString()
      vCardString = vCardString.replace(
        /SOCIALPROFILE;CHARSET=UTF-8;/gm,
        "SOCIALPROFILE;"
      )
      fs.writeFileSync(`${outputPath}/${person.uid}`, vCardString, {
        encoding: "utf8",
      })
    })
  }
}

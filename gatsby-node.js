const path = require("path")
const fs = require("fs-extra")
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
    if (!(await fs.pathExists(outputPath))) {
      await fs.mkdirp(outputPath)
    }

    const serializeResult = await options.serialize(baseQuery)

    serializeResult.forEach(person => {
      let vcard = vCardJS()
      Object.assign(vcard, person)

      vcard.saveToFile(`${outputPath}/${person.uid}.vcf`)
    })
  }
}

const { parse } = require("gatsby/graphql")
const { stripIndent } = require("common-tags")

module.exports = ({ Joi }) =>
  Joi.object({
    query: Joi.string().required(),
    serialize: Joi.func().required(),
    outputPath: Joi.string(),
  })
    .unknown(true)
    .external(({ query }) => {
      if (query) {
        try {
          parse(query)
        } catch (e) {
          throw new Error(
            stripIndent`
      Invalid plugin options for "gatsby-plugin-vcf":
      "query" must be a valid GraphQL query. Received the error "${e.message}"`
          )
        }
      }
    })

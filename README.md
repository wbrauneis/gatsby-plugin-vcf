# gatsby-plugin-vcf

Create vCard files (VCF) for your Gatsby site.

## Install

`npm install gatsby-plugin-vcf`

## How to Use

```javascript
// In your gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: `gatsby-plugin-vcf`,
      options: {
        query: `
              {
                allMarkdownRemark {
                  edges {
                    node {
                      frontmatter {
                        uid
                        lastName
                        firstName
                        workEmail
                        cellPhone
                        title
                      }
                    }
                  }
                }
              }
            `,
        serialize: ({ allMarkdownRemark }) =>
          allMarkdownRemark.edges.map(({ node }) => ({
            ...node.frontmatter,
            workUrl: "https://www.e-mundo.de/",
            organization: "eMundo GmbH",
          })),
      },
    },
  ],
}
```

Required options are `query`  and `serialize`. You'll need to write the `serialize` function in order to fit your use case.

`outputPath` is an optional configuration, indicating where the vcard files should be generated. 

_**Note**: This plugin only generates the `vcf` file(s) when run in `production` mode. To test your vcards, run: `gatsby build && gatsby serve`._

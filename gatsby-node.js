const { createFilePath } = require('gatsby-source-filesystem')
const path = require('path')

exports.onCreateNode = ({node, getNode, boundActionCreators}) => {
    if(node.internal.type == "MarkdownRemark") {
        const { createNodeField } = boundActionCreators
        const slug = createFilePath({node, getNode, basePath: 'pages'})
        createNodeField({
            node,
            name: 'slug',
            value: slug
        })
    }
}

exports.createPages = ({ graphql, boundActionCreators }) => {
    const { createPage } = boundActionCreators
    return new Promise((resolve, reject) => {
        graphql(`
        {
            allMarkdownRemark(sort: {fields: [frontmatter___date], order:DESC}) {
              totalCount
              edges {
                node {
                  fields {
                    slug
                  }
                }
              }
            }
          }
        `).then((results) => {
            results.data.allMarkdownRemark.edges.forEach(({node}) => {
                createPage({
                    path: node.fields.slug,
                    component: path.resolve(`./src/templates/blog-post.js`),
                    context: {
                        slug: node.fields.slug
                    }

                })
            })
            resolve()
        })
    })
}
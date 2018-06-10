const { createFilePath } = require('gatsby-source-filesystem')
const path = require('path')

const unified = require('unified')
const frontmatter = require('remark-frontmatter')
const yaml_config = require('remark-yaml-config')
const parse_yaml = require('remark-parse-yaml')
const remark = require('remark-parse')
const visit = require(`unist-util-visit`)
const remove = require(`unist-util-remove`)
const html = require('rehype-stringify')
const remark2rehype = require('remark-rehype')
const remark2string = require('remark-stringify')

const {makeHTML, makeMarkdownAST, makeRawMardown} = require('./src/utils/remark_utils')

exports.onCreateNode = ({node, getNode, boundActionCreators}) => {
    if(node.internal.type == "MarkdownRemark") {
        const { createNodeField } = boundActionCreators
        const slug = createFilePath({node, getNode, basePath: 'posts'})
        createNodeField({
            node,
            name: 'slug',
            value: slug
        })

        //finds integrated YAML
        let rawMarkdownBody = node.rawMarkdownBody
        let markdownAST = makeMarkdownAST(rawMarkdownBody)
        visit(markdownAST, `yaml`, local => node.frontmatter = local.data.parsedValue)
        remove(markdownAST, `yaml`)
        markdownAST.children.shift()

        rawMarkdownBody = makeRawMardown(markdownAST)
        node.internal.content = rawMarkdownBody

    }
}

exports.createPages = ({ graphql, boundActionCreators }) => {
    const { createPage } = boundActionCreators
    return new Promise((resolve, reject) => {
        graphql(`
        {
            allMarkdownRemark {
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
                    component: path.resolve(`./src/templates/post.js`),
                    context: {
                        slug: node.fields.slug
                    }

                })
            })
            resolve()
        })
    })
}
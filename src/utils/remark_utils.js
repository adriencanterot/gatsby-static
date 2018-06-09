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

module.exports.makeMarkdownAST = (raw) => {
    let processor = unified()
    .use(remark)
    .use(frontmatter, {type: `yaml`, fence: `- - - -`})
    .use(yaml_config) 
    .use(parse_yaml)  

    let markdownAST = processor.parse(raw)
    markdownAST = processor.runSync(markdownAST)

    return markdownAST
}

module.exports.makeRawMardown = (AST) => unified().use(remark2string).stringify(AST)


module.exports.makeHTML = (rawMarkdown) => {
    let htmlProcessor = unified()
    .use(remark)
    .use(remark2rehype)
    .use(html)

    let { contents } = htmlProcessor.processSync(rawMarkdown)
    return contents
}
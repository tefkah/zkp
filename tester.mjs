import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import { toString } from 'mdast-util-to-string'
import { visit } from 'unist-util-visit'

const processor = unified()
  .use(remarkParse)
  .use(() => (node) => {
    visit(node, 'blockquote', (quote) => {
      quote.type = 'html'
      quote.children = { type: 'text', value: `<!-- ${toString(quote.children)} -->` }
    })
  })
  .use(remarkRehype)
  .use(rehypeStringify)

const inputText = `# Heading

- list
- of
- thing

> Quote that shoudl be a comment`

const resultText = processor.processSync(inputText)

console.log(String(resultText))

import remarkStringify from 'remark-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeStringify from 'rehype-stringify'

import { unified } from 'unified'

export const markdownToHTML = async (markdown: string) => {
  const result = await unified()
    .use(remarkParse)
    .use(remarkStringify)
    .use(remarkRehype)
    .use(rehypeRaw)
    .use(rehypeStringify)
    .process(markdown)
  return result.toString()
}

import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'

const proc = unified().use(remarkParse).use(remarkRehype).use(rehypeStringify)

async function main() {
  const file = await proc.process('# Hey')
  console.log(String(file))
}

main()

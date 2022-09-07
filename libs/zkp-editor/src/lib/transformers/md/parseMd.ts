import remarkMath from 'remark-math'
import remarkGFM from 'remark-gfm'
import remarkParse from 'remark-parse'
import { unified } from 'unified'
import { remarkToSlate as remarkSlate } from 'remark-slate-transformer'
import { Descendant } from 'slate'

export const parseMd = async (md: string) => {
  const proc = unified().use(remarkParse).use(remarkMath).use(remarkGFM)
  const parsed = proc.parse(md)
  return await proc.run(parsed)
  // return proc.processSync(md). as Descendant[]
}

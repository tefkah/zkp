import remarkMath from 'remark-math'
import remarkGFM from 'remark-gfm'
import remarkParse from 'remark-parse'
import { unified } from 'unified'
import { remarkToSlate as remarkSlate } from 'remark-slate-transformer'
import { Descendant } from 'slate'

export const mdSlate = (md: string): Descendant[] => {
  const proc = unified().use(remarkParse).use(remarkMath).use(remarkGFM).use(remarkSlate, {})
  return proc.processSync(md).result as Descendant[]
}

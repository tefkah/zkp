import {} from 'remark-slate-transformer'
import { InlineCiteNode } from '@benrbray/mdast-util-cite'

/**
 * TODO: Add support for `As mentioned in @Shech2019` like in rehypeCitation
 */
export const cite = (node: InlineCiteNode, next: (children: any[]) => any) => {
  const { type, position, value, ...rest } = node
  return {
    ...rest,
    type: 'cite',
    text: value,
  }
}

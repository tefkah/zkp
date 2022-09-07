import {} from 'remark-slate-transformer'
import {
  MdxFlowExpression,
  MdxjsEsm,
  MdxJsxExpressionAttribute,
  MdxJsxFlowElement,
  MdxJsxTextElement,
  MdxTextExpression,
} from 'mdast-util-mdx'
import { SlateMDX } from '../../../types'

/**
 * TODO: Add support for `As mentioned in @Shech2019` like in rehypeCitation
 */
export const mdx = (
  node:
    | MdxTextExpression
    | MdxFlowExpression
    | MdxJsxTextElement
    | MdxjsEsm
    | MdxJsxFlowElement
    | MdxJsxExpressionAttribute,
  next: (children: any[]) => any,
) => {
  const { type, position, value, ...rest } = node
  console.log(node)
  return {
    ...rest,
    type: 'mdx',
    ...(value || rest.data ? { text: value || '' } : {}),
  }
}

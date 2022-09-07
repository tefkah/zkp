import * as slate from 'slate'
import { SlateNode } from 'remark-slate-transformer/lib/transformers/mdast-to-slate'
import { InlineCiteNode } from '@benrbray/mdast-util-cite'

import {
  Text as MdastText,
  Content as MdastContent,
  Parent as MdastParent,
  Paragraph as MdastParagraph,
} from 'mdast'
import { Parent as UnistParent, Node as UnistNode } from 'unist'

export type Node = Editor | Element | Text
export type Editor = slate.Editor
export type Element = slate.Element & { type: string }
export type Text = slate.Text

export interface WikiLink {
  type: 'wikiLink'
  value: string
  data: Data
}

interface Data {
  alias: string
  permalink: string
  exists: boolean
  hName: string
  hProperties: HProperties
  hChildren: HChild[]
}

interface HChild {
  type: string
  value: string
}

interface HProperties {
  className: string
  href: string
}

export interface SlateWikiLink {
  type: 'wikiLink'
  children: slate.Node[]
  url: string
  title: string
  exists: boolean
}
export interface SlateCite {
  type: 'cite'
  value: string
  data: InlineCiteNode['data']
}

export interface SlateMDX {
  type: 'mdx'
  children: any[]
}

export interface SlateMDXTextExpression {
  type: ''
}

export interface Paragraph {
  type: 'paragraph'
  children: Text[]
}

export interface Heading {
  type: 'heading'
  depth: number
  children: Text[]
}

export type UnistChildrenToSlateChildren<T extends MdastContent[] = MdastContent[]> = Extract<
  T[number],
  MdastText
> extends MdastText
  ? (Exclude<T[number], MdastText> | Text)[]
  : T

export type MdastParentToSlate<T extends MdastParent = Extract<MdastContent, { children: any }>> =
  T & {
    type: T['type']
    children: UnistChildrenToSlateChildren<T['children']>
  }

export type RemarkSlate<T extends MdastContent = MdastContent> = T extends MdastParent
  ? MdastParentToSlate<T>
  : T

export type SlateText = { text: string } & { highlight?: boolean } & { bold?: boolean } & {
  italic?: boolean
} & { underline?: boolean } & { strikethrough?: boolean } & { comment?: string }

export type SlateNodes = SlateNode | SlateWikiLink | SlateCite | SlateMDX
export type SlateMarkdownElement = Exclude<SlateNodes, { text: string }>
export type SlateMarkdownLeaf = Extract<SlateNode, { text: string }>

import * as slate from 'slate'
import { SlateNode } from 'remark-slate-transformer/lib/transformers/mdast-to-slate'
import { InlineCiteNode } from '@benrbray/mdast-util-cite'

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
  text: string
  data: InlineCiteNode['data']
}

export interface SlateMDX {
  type: 'mdx'
  children: any[]
}

export type SlateNodes = SlateNode | SlateWikiLink | SlateCite | SlateMDX
export type SlateMarkdownElement = Exclude<SlateNodes, { text: string }>
export type SlateMarkdownLeaf = Extract<SlateNode, { text: string }>

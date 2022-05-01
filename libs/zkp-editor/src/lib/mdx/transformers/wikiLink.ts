import {} from 'remark-slate-transformer'
import { WikiLink } from '../../types'

export const wikiLink = (node: WikiLink, next: (children: any[]) => any) => ({
  type: 'wikiLink',
  children: next(node.data.hChildren),
  url: node.data.permalink,
  title: node.data.alias,
  exists: node.data.exists,
})

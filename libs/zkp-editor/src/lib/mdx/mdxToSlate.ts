import { remarkToSlate as remarkSlate } from 'remark-slate-transformer'
import remarkParse from 'remark-parse'
import remarkGFM from 'remark-gfm'
import remarkMath from 'remark-math'
// @ts-expect-error no types
import remarkWikiLink from 'remark-wiki-link'
import { citePlugin as remarkCite } from '@benrbray/remark-cite'
import remarkMDX from 'remark-mdx'
import { unified } from 'unified'
import { wikiLink } from './transformers/wikiLink'
import { OverridedMdastBuilders } from 'remark-slate-transformer/lib/transformers/mdast-to-slate'
import { cite } from './transformers/cite'

export const mdxSlate = (mdx: string, bibliography?: string) => {
  const proc = unified()
    .use(remarkParse)
    .use(remarkMDX)
    .use(remarkGFM)
    /* so annoying... */
    .use(remarkCite, {})
    .use(remarkWikiLink, { aliasDivider: '|' })
    .use(remarkMath)
    .use(remarkSlate, {
      overrides: { wikiLink, cite } as OverridedMdastBuilders,
    })

  return proc.processSync(mdx).result
}

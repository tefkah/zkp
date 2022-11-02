import matter from 'gray-matter'
import { serialize } from 'next-mdx-remote/serialize'
import remarkMath from 'remark-math'
// import rehypeCitation from 'rehype-citation'
import remarkGFM from 'remark-gfm'
// @ts-expect-error no types
import remarkWikiLink from 'remark-wiki-link'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import rehypeKatex from 'rehype-katex'
import { slugify } from '@zkp/slugify'
import { Pluggable } from 'unified'

export const mdxSerialize = async (
  input: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  options?: {
    bibliography?: string
    pageResolver?: (page: string) => string[]
    hrefTemplate?: (page: string) => string
  },
): Promise<{
  frontMatter: Record<string, any>
  source: MDXRemoteSerializeResult<Record<string, unknown>>
}> => {
  const { bibliography, pageResolver, hrefTemplate } = options || {}

  const { content, data } = matter(input)
  const wikiLinkOptionsDefaults = {
    pageResolver: (name: string) => [slugify(name)],
    hrefTemplate: (permalink: string) => `${permalink}`,
    aliasDivider: '|',
  }

  const wikiLinkOptions = {
    ...wikiLinkOptionsDefaults,
    ...(pageResolver && { pageResolver }),
    ...(hrefTemplate && { hrefTemplate }),
  }

  try {
    const citation = // process.env.NEXT_RUNTIME !== 'experimental-edge'
      // ?
      [
        // [
        //   rehypeCitation,
        //   {
        //     bibliography,
        //     csl: 'apa',
        //   },
        // ],
      ] as Pluggable<any[]>[] // : []
    const rehypePlugins = [rehypeKatex, ...citation]

    const mdxSource = await serialize(content, {
      // Optionally pass remark/rehype plugins
      mdxOptions: {
        remarkPlugins: [remarkMath, remarkGFM, [remarkWikiLink, wikiLinkOptions]],

        rehypePlugins,
        // [
        //   rehypeCitation,
        //   {
        //     bibliography,
        //     csl: 'apa',
        //     // inlineClass: 'citation',
        //   },
        // ],
      },
      scope: data,
    })
    return { frontMatter: data, source: mdxSource }
  } catch (e) {
    console.error(e)
    return await mdxSerialize(`Something went wrong while rendering this page, please contact the administrator and show them this.
   \`\`\`
   ${e}
   \`\`\`
    `)
  }
}

export default mdxSerialize

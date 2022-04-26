import matter from 'gray-matter'
import { serialize } from 'next-mdx-remote/serialize'
import remarkMath from 'remark-math'
import rehypeCitation from 'rehype-citation'
import remarkGFM from 'remark-gfm'
// @ts-expect-error no types
import remarkWikiLink from 'remark-wiki-link'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import rehypeKatex from 'rehype-katex'
import { slugify } from '../slug'

export const mdxSerialize = async (
  input: string,
  bibliography?: string,
): Promise<{
  frontMatter: Record<string, any>
  source: MDXRemoteSerializeResult<Record<string, unknown>>
}> => {
  const { content, data } = matter(input)
  const wikiLinkOptions = {
    pageResolver: (name: string) => [slugify(name)],
    hrefTemplate: (permalink: string) => `/${permalink}`,
  }
  const mdxSource = await serialize(content, {
    // Optionally pass remark/rehype plugins
    mdxOptions: {
      remarkPlugins: [remarkMath, remarkGFM, [remarkWikiLink, wikiLinkOptions]],

      rehypePlugins: [
        rehypeKatex,
        [
          rehypeCitation,
          {
            bibliography,
            // inlineClass: 'citation',
          },
        ],
      ],
    },
    scope: data,
  })

  return { frontMatter: data, source: mdxSource }
}

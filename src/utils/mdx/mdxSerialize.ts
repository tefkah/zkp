import matter from 'gray-matter'
import { serialize } from 'next-mdx-remote/serialize'
import remarkMath from 'remark-math'
import rehypeCitation from 'rehype-citation'
import remarkGFM from 'remark-gfm'
// @ts-expect-error no types
import remarkWikiLink from 'remark-wiki-link'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'

export const mdxSerialize = async (
  input: string,
  bibliography: string,
): Promise<{
  frontMatter: Record<string, any>
  source: MDXRemoteSerializeResult<Record<string, unknown>>
}> => {
  const { content, data } = matter(input)

  const mdxSource = await serialize(content, {
    // Optionally pass remark/rehype plugins
    mdxOptions: {
      remarkPlugins: [remarkMath, remarkGFM, remarkWikiLink],
      rehypePlugins: [
        [
          rehypeCitation,
          {
            bibliography: bibliography,
            inlineClass: 'citation',
          },
        ],
      ],
    },
    scope: data,
  })

  return { frontMatter: data, source: mdxSource }
}

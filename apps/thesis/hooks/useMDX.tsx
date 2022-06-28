import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import useSWR from 'swr'
import { mdxFetcher } from '../utils/fetchers/mdxFetcher'

export const useMDX = (slug: string) => {
  const cleanSlug = slug.replace(/\//g, '')
  const { data, error } = useSWR<{
    frontMatter: Record<string, any>
    source: MDXRemoteSerializeResult<Record<string, unknown>>
  }>(`${cleanSlug}`, mdxFetcher)

  return { data, isLoading: !data && !error, isError: !!error || !data?.source?.compiledSource }
}

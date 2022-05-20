import useSWR from 'swr'
import { mdxFetcher } from '../utils/fetchers/mdxFetcher'

export const useMDX = (slug: string) => {
  const cleanSlug = slug.replace(/\//g, '')
  const { data, error } = useSWR(`notes/${cleanSlug}`, mdxFetcher)
  return { data, isLoading: !data && !error, isError: !!error || !data?.source?.compiledSource }
}

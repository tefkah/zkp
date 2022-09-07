import mdxSerialize from '@zkp/mdxSerialize'
import useSWR from 'swr'

const fetcher = (input: string) => mdxSerialize(input).then((data) => data)
export const useMDX = (input: string) => {
  const { data, error } = useSWR(input, fetcher)

  return { data, error, isLoading: !data && !error }
}

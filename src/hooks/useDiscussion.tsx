import useSWR from 'swr'
import { getDiscussion, GetDiscussionParams } from '../queries/getDiscussion'

export function useDiscussion(props: GetDiscussionParams, options?: IntersectionObserverInit) {
  const fetcher = async (resource: string, options: {}) => await getDiscussion(props, data)

  const { data, error } = useSWR('/api/auth/gha')
  const isLoading = !data || error

  const { data: gqldata, error: gqlerror } = useSWR(
    isLoading ? null : 'https://api.github.com/graphql',
    fetcher,
  )

  const gqlIsLoading = !gqldata || error
  if (isLoading) return { data: null, isLoading: true, error }

  if (gqlIsLoading) {
    return { data: null, isLoading: true, error }
  }

  return { data: gqldata, isLoading: false, error: gqlerror }
}

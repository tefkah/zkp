import useSWR from 'swr'
import makeGenericGraphQlRequest from '../queries/makeGenericGraphQLRequest'

export function useGQL(query: string, options?: IntersectionObserverInit) {
  const fetcher = async (resource: string, options: {}) =>
    await makeGenericGraphQlRequest({ request: query, token: data, post: true })

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

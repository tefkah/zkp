import { useCallback } from 'react'
import useSWR from 'swr'
import { makeGenericGraphQlRequest } from '../queries/makeGenericGraphQLRequest'

export const useGQL = (query: string) => {
  const { data, error } = useSWR('/api/auth/gha')
  const isLoading = !data || error

  const fetcher = useCallback(
    async () => makeGenericGraphQlRequest({ request: query, token: data, post: true }),
    [data, query],
  )

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

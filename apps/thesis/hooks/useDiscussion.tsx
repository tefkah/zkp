import useSWR from 'swr'
import { getDiscussion, GetDiscussionParams } from '../queries/getDiscussionPageDiscussion'
// import { getDiscussion, GetDiscussionParams } from '@zkp/discus'

export const useDiscussion = (props: GetDiscussionParams) => {
  const { data, error } = useSWR('/api/auth/gha')
  const isLoading = !data || error

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const fetcher = async (_resource: string, _options: Record<string, unknown>) =>
    getDiscussion(props, data?.token)

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

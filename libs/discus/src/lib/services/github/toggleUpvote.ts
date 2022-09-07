// ported from the great https://github.com/giscus/giscus

import { ToggleUpvoteBody, ToggleUpvoteResponse } from '@zkp/types'

const TOGGLE_UPVOTE_QUERY = (mode: 'Add' | 'Remove') => `
  mutation($upvoteInput: ${mode}UpvoteInput!) {
    toggleUpvote: ${mode.toLowerCase()}Upvote(input: $upvoteInput) {
      subject {
        upvoteCount
      }
    }
  }`

export const toggleUpvote = async (
  params: ToggleUpvoteBody,
  token: string,
  viewerHasUpvoted: boolean,
): Promise<ToggleUpvoteResponse> =>
  fetch(process.env.GITHUB_GRAPHQL_API_URL!, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: TOGGLE_UPVOTE_QUERY(viewerHasUpvoted ? 'Remove' : 'Add'),
      variables: params,
    }),
  }).then((r) => r.json())

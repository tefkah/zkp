// ported from the great https://github.com/giscus/giscus

import { GCreateDiscussionInput } from '@zkp/types'

const GITHUB_GRAPHQL_API_URL = 'https://api.github.com/graphql'

const CREATE_DISCUSSION_QUERY = `
  mutation($input: CreateDiscussionInput!) {
    createDiscussion(input: $input) {
      discussion {
        id
      }
    }
  }`

export interface CreateDiscussionBody {
  input: GCreateDiscussionInput
}

export interface CreateDiscussionResponse {
  data: {
    createDiscussion: {
      discussion: {
        id: string
      }
    }
  }
}

export const createDiscussion = async (
  token: string,
  params: CreateDiscussionBody,
): Promise<CreateDiscussionResponse> =>
  fetch(GITHUB_GRAPHQL_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: CREATE_DISCUSSION_QUERY,
      variables: params,
    }),
  }).then((r) => r.json())

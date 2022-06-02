// ported from the great https://github.com/giscus/giscus

import { GDiscussionCategory, GError } from '@zkp/types'

const GITHUB_GRAPHQL_API_URL = 'https://api.github.com/graphql'
const GET_DISCUSSION_CATEGORIES_QUERY = `
  query($query: String!) {
    search(type: REPOSITORY query: $query first:1) {
      nodes {
        ... on Repository {
          id
          discussionCategories(first: 100) {
            nodes {
              id
              name
              emojiHTML
            }
          }
        }
      }
    }
  }`

export interface GetDiscussionCategoriesParams {
  repo: string
}

export interface GetDiscussionCategoriesResponse {
  data: {
    search: {
      nodes: Array<{
        id: string
        discussionCategories: {
          nodes: GDiscussionCategory[]
        }
      }>
    }
  }
}

export const getDiscussionCategories = async (
  params: GetDiscussionCategoriesParams,
  token: string,
): Promise<GetDiscussionCategoriesResponse | GError> => {
  const query = `repo:${params.repo} fork:true`

  return fetch(GITHUB_GRAPHQL_API_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },

    body: JSON.stringify({
      query: GET_DISCUSSION_CATEGORIES_QUERY,
      variables: { query },
    }),
  }).then((r) => r.json())
}

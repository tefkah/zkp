// ported from the great https://github.com/giscus/giscus

import { DiscussionQuery, PaginationParams } from '../../types'
import { GUser, GRepositoryDiscussion, GError, GMultipleErrors } from '../../types'
import { parseRepoWithOwner } from '../../utils/giscus/utils'

const GITHUB_GRAPHQL_API_URL = 'https://api.github.com/graphql'

const DISCUSSION_QUERY = `
  body
  id
  url
  locked
  repository {
    nameWithOwner
  }
  reactions {
    totalCount
  }
  reactionGroups {
    content
    users {
      totalCount
    }
    viewerHasReacted
  }
  comments(first: $first last: $last after: $after before: $before) {
    totalCount
    pageInfo {
      startCursor
      hasNextPage
      hasPreviousPage
      endCursor
    }
    nodes {
      id
      upvoteCount
      viewerHasUpvoted
      viewerCanUpvote
      author {
        avatarUrl
        login
        url
      }
      viewerDidAuthor
      createdAt
      url
      authorAssociation
      lastEditedAt
      deletedAt
      isMinimized
      body
      reactionGroups {
        content
        users {
          totalCount
        }
        viewerHasReacted
      }
      replies(last: 100) {
        totalCount
        nodes {
          id
          author {
            avatarUrl
            login
            url
          }
          viewerDidAuthor
          createdAt
          url
          authorAssociation
          lastEditedAt
          deletedAt
          isMinimized
          body
          reactionGroups {
            content
            users {
              totalCount
            }
            viewerHasReacted
          }
          replyTo {
            id
          }
        }
      }
    }
  }`

const SEARCH_QUERY = `
  search(type: DISCUSSION last: 1 query: $query) {
    discussionCount
    nodes {
      ... on Discussion {
        ${DISCUSSION_QUERY}
      }
    }
  }`

const SPECIFIC_QUERY = `
  repository(owner: $owner, name: $name) {
    discussion(number: $number) {
      ${DISCUSSION_QUERY}
    }
  }
`

const GET_DISCUSSION_QUERY = (type: 'term' | 'number') => `
  query(${
    type === 'term' ? '$query: String!' : '$owner: String! $name: String! $number: Int!'
  } $first: Int $last: Int $after: String $before: String) {
    viewer {
      avatarUrl
      login
      url
    }
    ${type === 'term' ? SEARCH_QUERY : SPECIFIC_QUERY}
  }`

export interface GetDiscussionParams extends PaginationParams, DiscussionQuery {}

interface SearchResponse {
  data: {
    viewer: GUser
    search: {
      discussionCount: number
      nodes: Array<GRepositoryDiscussion>
    }
  }
}

interface SpecificResponse {
  data: {
    viewer: GUser
    repository: {
      discussion: GRepositoryDiscussion
    }
  }
}

export type GetDiscussionResponse = SearchResponse | SpecificResponse

export const getDiscussion = async (
  params: GetDiscussionParams,
  token: string,
): Promise<GetDiscussionResponse | GError | GMultipleErrors> => {
  const { repo: repoWithOwner, term, number, category, ...pagination } = params

  // Force repo to lowercase to prevent GitHub's bug when using category in query.
  // https://github.com/giscus/giscus/issues/118
  const repo = repoWithOwner.toLowerCase()
  const categoryQuery = category ? `category:${JSON.stringify(category)}` : ''
  const query = `repo:${repo} ${categoryQuery} in:title ${JSON.stringify(term)}`
  const gql = GET_DISCUSSION_QUERY(number ? 'number' : 'term')

  return fetch(GITHUB_GRAPHQL_API_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },

    body: JSON.stringify({
      query: gql,
      variables: {
        repo,
        query,
        number,
        ...parseRepoWithOwner(repo),
        ...pagination,
      },
    }),
  }).then((r) => r.json())
}

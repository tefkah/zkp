import {
  DiscussionQuery,
  GetDiscussionParams,
  GetDiscussionResponse,
  PaginationParams,
} from '@zkp/types'
import { GUser, GRepositoryDiscussion, GError, GMultipleErrors } from '@zkp/types'
import { parseRepoWithOwner } from '../utils/giscus/utils'

const GITHUB_GRAPHQL_API_URL = 'https://api.github.com/graphql'

export const CATEGORY_LIST_QUERY = `
{
  repository(name: "thesis-discussions", owner: "thomasfkjorna") {
    discussionCategories(first: 10) {
      nodes {
        emoji
        emojiHTML
        id
        name
        description
      }
    }
  }
}
`

const PLAIN_DISCUSSION_QUERY = `
         body
          title
          updatedAt
          comments(first: 100) {
            totalCount
            edges {
              node {
                replies(first: 100) {
                  totalCount
                }
              }
            }
          }
          category {
            description
            emojiHTML
            name
          }
          author {
            avatarUrl
            login
            url
          }
`

const DISCUSSION_QUERY = `
  id
  body
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
      viewerCanDelete
      viewerCanUpdate
      viewerCanUnmarkAsAnswer
      viewerCanMarkAsAnswer
      viewerCanMinimize
      createdAt
      url
      authorAssociation
      lastEditedAt
      deletedAt
      isMinimized
      bodyHTML
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
          bodyHTML
          viewerCanDelete
          viewerCanUpdate
          viewerCanUnmarkAsAnswer
          viewerCanMarkAsAnswer
          viewerCanMinimize
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

const GENERAL_QUERY = `
repository(name: $name, owner: $owner) {
    discussions(first: $first last: $last before: $before after: $after orderBy: {field: UPDATED_AT, direction: DESC}) {
      edges {
        cursor
        node {
            ${PLAIN_DISCUSSION_QUERY}
        }
    }
}
}
`

const GET_DISCUSSION_QUERY = (type: 'term' | 'number' | 'list') => `
  query(${
    type === 'term'
      ? '$query: String!'
      : type === 'list'
      ? '$owner: String! $name: String!'
      : '$owner: String! $name: String! $number: Int!'
  } $first: Int $last: Int $after: String $before: String) {
    viewer {
      avatarUrl
      login
      url
    }
    ${type === 'term' ? SEARCH_QUERY : type === 'list' ? GENERAL_QUERY : SPECIFIC_QUERY}
  }`

export async function getDiscussion(
  params: GetDiscussionParams,
  token: string,
): Promise<GetDiscussionResponse | GError | GMultipleErrors> {
  const { repo: repoWithOwner, term, number, category, list, ...pagination } = params

  // Force repo to lowercase to prevent GitHub's bug when using category in query.
  // https://github.com/giscus/giscus/issues/118
  const repo = repoWithOwner.toLowerCase()
  const categoryQuery = category ? `category:${JSON.stringify(category)}` : ''
  const query = `repo:${repo} ${categoryQuery} in:title ${JSON.stringify(term)}`
  const gql = GET_DISCUSSION_QUERY(list ? 'list' : number ? 'number' : 'term')

  return fetch(GITHUB_GRAPHQL_API_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },

    body: JSON.stringify({
      query: gql,
      variables: {
        repo,
        query,
        ...(list ? {} : { number }),
        ...parseRepoWithOwner(repo),
        ...pagination,
      },
    }),
  }).then((r) => r.json())
}

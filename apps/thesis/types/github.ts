// ported from the great https://github.com/giscus/giscus

export interface GUser {
  avatarUrl: string
  login: string
  url: string
}

export type GRepositoryDiscussionAuthor = GUser

export type GCommentAuthorAssociation =
  | 'COLLABORATOR'
  | 'CONTRIBUTOR'
  | 'FIRST_TIMER'
  | 'FIRST_TIME_CONTRIBUTOR'
  | 'MANNEQUIN'
  | 'MEMBER'
  | 'NONE'
  | 'OWNER'

export interface GReactionGroup {
  content: keyof IReactions
  users: {
    totalCount: number
  }
  viewerHasReacted: boolean
}

interface GBaseComment {
  id: string
  author: GRepositoryDiscussionAuthor
  viewerDidAuthor: boolean
  createdAt: string
  url: string
  authorAssociation: GCommentAuthorAssociation
  lastEditedAt: string | null
  deletedAt: string | null
  isMinimized: boolean
  bodyHTML: string
  body: string
  reactionGroups: GReactionGroup[]
}

export interface GReply extends GBaseComment {
  replyTo: {
    id: string
  }
}

export interface GComment extends GBaseComment {
  upvoteCount: number
  viewerHasUpvoted: boolean
  viewerCanUpvote: boolean
  replies: {
    totalCount: number
    nodes: GReply[]
  }
}

export interface GRepositoryDiscussion {
  body: string
  id: string
  url: string
  locked: boolean
  repository: {
    nameWithOwner: string
  }
  reactions: {
    totalCount: number
  }
  reactionGroups: GReactionGroup[]
  comments: {
    totalCount: number
    pageInfo: {
      startCursor: string
      hasNextPage: boolean
      hasPreviousPage: boolean
      endCursor: string
    }
    nodes: GComment[]
  }
}

export interface GDiscussionCategory {
  id: string
  name: string
  emojiHTML: string
}

export interface GCreateDiscussionInput {
  repositoryId: string
  categoryId: string
  title: string
  body: string
}

export interface GError {
  message: string
  documentation_url: string
}

export interface GMultipleErrors {
  errors: Array<{
    type?: string
    message: string
  }>
}

export const Reactions: IReactions = {
  THUMBS_UP: '👍',
  THUMBS_DOWN: '👎',
  LAUGH: '😆',
  HOORAY: '🎉',
  CONFUSED: '😕',
  HEART: '❤️',
  ROCKET: '🚀',
  EYES: '👀',
} as const

export interface IReactions {
  THUMBS_UP: '👍'
  THUMBS_DOWN: '👎'
  LAUGH: '😆'
  HOORAY: '🎉'
  CONFUSED: '😕'
  HEART: '❤️'
  ROCKET: '🚀'
  EYES: '👀'
}

export type Reaction = keyof IReactions

// ported from the great https://github.com/giscus/giscus

import { Reactions } from './github'

export interface IUser {
  avatarUrl: string
  login: string
  url: string
}

export type IReactionGroups = {
  [key in keyof typeof Reactions]: {
    count: number
    viewerHasReacted: boolean
  }
}

type ICommentAuthorAssociation =
  | 'COLLABORATOR'
  | 'CONTRIBUTOR'
  | 'FIRST_TIMER'
  | 'FIRST_TIME_CONTRIBUTOR'
  | 'MANNEQUIN'
  | 'MEMBER'
  | 'NONE'
  | 'OWNER'
  | 'APP'

interface IBaseComment {
  id: string
  author: IUser
  viewerDidAuthor: boolean
  createdAt: string
  url: string
  authorAssociation: ICommentAuthorAssociation
  lastEditedAt: string | null
  deletedAt: string | null
  isMinimized: boolean
  body: string
  reactions: IReactionGroups
  viewerCanDelete: boolean
  viewerCanUpdate: boolean
  viewerCanUnmarkAsAnswer: boolean
  viewerCanMarkAsAnswer: boolean
  viewerCanMinimize: boolean
}

export interface IReply extends IBaseComment {
  replyToId: string
}

export interface IComment extends IBaseComment {
  upvoteCount: number
  viewerHasUpvoted: boolean
  viewerCanUpvote: boolean
  replyCount: number
  replies: IReply[]
}

export interface IGiscussion {
  viewer: IUser
  discussion: {
    id: string
    url: string
    body: string
    locked: boolean
    totalCommentCount: number
    totalReplyCount: number
    pageInfo: {
      startCursor: string
      hasNextPage: boolean
      hasPreviousPage: boolean
      endCursor: string
    }
    repository: {
      nameWithOwner: string
    }
    reactionCount: number
    reactions: IReactionGroups
    comments: IComment[]
  }
}

export interface ICategory {
  id: string
  name: string
  emoji: string
}

export interface ICategories {
  repositoryId: string
  categories: ICategory[]
}

export interface IError {
  error: string
}

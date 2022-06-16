import { DiscussionQuery, PaginationParams } from '../common.js'
import { GRepositoryDiscussion, GUser } from './githubGiscus.js'

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

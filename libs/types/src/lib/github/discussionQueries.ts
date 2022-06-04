import { DiscussionQuery, PaginationParams } from '../common'
import { GRepositoryDiscussion, GUser } from './githubGiscus'

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

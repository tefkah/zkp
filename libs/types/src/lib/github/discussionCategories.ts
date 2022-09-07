import { GDiscussionCategory } from './githubGiscus.js'

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

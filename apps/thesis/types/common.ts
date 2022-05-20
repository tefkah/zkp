// ported from the great https://github.com/giscus/giscus

export interface PaginationParams {
  first?: number
  last?: number
  after?: string
  before?: string
}

export interface DiscussionQuery {
  list?: boolean
  repo: string
  term: string
  number?: number
  category: string
}

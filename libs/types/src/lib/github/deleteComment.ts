import { GenericMutationBody } from './mutations.js'

export interface DeleteCommentBody extends GenericMutationBody {
  commentID: string
}

export interface DeleteCommentResponse {
  data: {
    comment: {
      id: string
    }
  }
}

export interface ToggleUpvoteBody {
  upvoteInput: { subjectId: string }
}

export interface ToggleUpvoteResponse {
  data: {
    toggleUpvote: {
      subject: {
        upvoteCount: number
      }
    }
  }
}

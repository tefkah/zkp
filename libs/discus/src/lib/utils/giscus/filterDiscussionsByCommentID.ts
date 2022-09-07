import { adaptDiscussion } from '@zkp/discus'

export const filterDiscussionByCommentID = (
  adaptedDiscussion: Exclude<ReturnType<typeof adaptDiscussion>, { discussion: null }>,
  commentID: string,
) => {
  // if (!adaptedDiscussion.discussion) return adaptedDiscussion

  const { comments } = adaptedDiscussion.discussion

  const filteredComments = comments.filter((comment) => comment.id === commentID)

  return {
    ...adaptedDiscussion,
    discussion: { ...adaptedDiscussion.discussion, comments: filteredComments },
  }
}

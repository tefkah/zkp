// ported from the great https://github.com/giscus/giscus

import { DeleteCommentBody, DeleteCommentResponse } from '@zkp/types'

const DELETE_COMMENT_QUERY = `mutation($commentID: ID!) {
    deleteDiscussionComment(input: {id: $commentID}) {
      comment {
        id
      }
    }
  }`

export const deleteComment = async (
  params: DeleteCommentBody,
  token: string,
): Promise<DeleteCommentResponse> =>
  fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: DELETE_COMMENT_QUERY,
      variables: {
        ...params,
        clientMutationID: params.clientMutationID || 'zkp@thesis.tefkah.com',
      },
    }),
  })
    .then((r) => {
      console.log(r)
      return r.json()
    })
    .catch((e) => console.error(e))

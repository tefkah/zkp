import { IGiscussion, IReply } from '@zkp/types'
import { KeyedMutator } from 'swr'

export const addNewReply =
  ({ mutate, data }: { mutate: KeyedMutator<IGiscussion[]>; data: IGiscussion[] | undefined }) =>
  (reply: IReply) => {
    const newData = data?.map((page) => ({
      ...page,
      discussion: {
        ...page.discussion,
        comments: page.discussion.comments.map((comment) =>
          comment.id === reply.replyToId
            ? { ...comment, replies: [...comment.replies, reply] }
            : comment,
        ),
      },
    }))
    mutate(newData, false)
    return mutate()
  }

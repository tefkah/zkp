import { IComment, IGiscussion, IReply } from '@zkp/types'
import { KeyedMutator } from 'swr'

export const updateReply =
  ({ mutate, data }: { mutate: KeyedMutator<IGiscussion[]>; data: IGiscussion[] | undefined }) =>
  (newReply: IReply, promise?: Promise<unknown>) =>
    mutate(
      data?.map((page) => ({
        ...page,
        discussion: {
          ...page.discussion,
          comments: page.discussion.comments.map((comment) =>
            comment.id === newReply.replyToId
              ? {
                  ...comment,
                  replies: comment.replies.map((reply) =>
                    reply.id === newReply.id ? newReply : reply,
                  ),
                }
              : comment,
          ),
        },
      })),
      !promise,
    )
      .then(() => promise?.then(() => mutate()))
      .catch((e) => console.error(e))

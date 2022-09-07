import { IComment, IGiscussion, IReply } from '@zkp/types'
import { KeyedMutator } from 'swr'

export const deleteReply =
  ({ mutate, data }: { mutate: KeyedMutator<IGiscussion[]>; data: IGiscussion[] | undefined }) =>
  (newReply: IReply, promise?: Promise<unknown>) =>
    mutate(
      data?.map((page) => ({
        ...page,
        discussion: {
          ...page.discussion,
          comments: page.discussion.comments.filter((comment) => comment.id !== newReply.replyToId),
        },
      })),
      !promise,
    )
      .then(() => promise?.then(() => mutate()))
      .catch((e) => console.error(e))

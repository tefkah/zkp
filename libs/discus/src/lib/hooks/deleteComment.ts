import { IComment, IGiscussion } from '@zkp/types'
import { KeyedMutator } from 'swr'

export const deleteComment =
  ({ mutate, data }: { mutate: KeyedMutator<IGiscussion[]>; data: IGiscussion[] | undefined }) =>
  (newComment: IComment, promise?: Promise<unknown>) =>
    mutate(
      data?.map((page) => ({
        ...page,
        discussion: {
          ...page.discussion,
          comments: page.discussion.comments.filter((comment) => comment.id !== newComment.id),
        },
      })),
      !promise,
    ).then(() => promise?.then(() => mutate()))

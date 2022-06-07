import { IComment, IGiscussion } from '@zkp/types'
import { KeyedMutator } from 'swr'

export const updateComment =
  ({ mutate, data }: { mutate: KeyedMutator<IGiscussion[]>; data: IGiscussion[] | undefined }) =>
  (newComment: IComment, promise?: Promise<unknown>) =>
    mutate(
      data?.map((page) => ({
        ...page,
        discussion: {
          ...page.discussion,
          comments: page.discussion.comments.map((comment) =>
            comment.id === newComment.id ? newComment : comment,
          ),
        },
      })),
      !promise,
    ).then(() => promise?.then(() => mutate()))

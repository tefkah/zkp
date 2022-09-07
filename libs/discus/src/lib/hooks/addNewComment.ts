import { IComment, IGiscussion } from '@zkp/types'
import { KeyedMutator } from 'swr'

export const addNewComment =
  ({ mutate, data }: { mutate: KeyedMutator<IGiscussion[]>; data: IGiscussion[] | undefined }) =>
  (comment: IComment) => {
    if (!data) return mutate()
    const firstPage = data.slice(0, data.length - 1)
    const [lastPage] = data.slice(-1)
    mutate(
      [
        ...firstPage,
        {
          ...lastPage,
          discussion: {
            ...lastPage.discussion,
            comments: [...(lastPage.discussion?.comments || []), comment],
          },
        },
      ],
      false,
    )
    return mutate()
  }

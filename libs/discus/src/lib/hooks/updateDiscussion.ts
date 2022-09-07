import { IComment, IGiscussion } from '@zkp/types'
import { KeyedMutator } from 'swr'

export const updateDiscussion =
  ({ mutate }: { mutate: KeyedMutator<IGiscussion[]> }) =>
  (newDiscussions: IGiscussion[], promise?: Promise<unknown>) =>
    mutate(newDiscussions, !promise).then(() => promise?.then(() => mutate()))

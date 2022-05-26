import { Skeleton } from '@chakra-ui/react'
import { Diff } from '@zkp/types'
// TODO: Port diffs to MDX
import { ParsedDiff } from '../../services/thesis/parseDiff'
import { DiffBox } from './DiffBox'

export const ParsedCommit = (props: { commitData: Diff[]; isLoading: boolean }) => {
  const { commitData, isLoading } = props
  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {commitData
        ?.filter((rawCommit) => rawCommit)
        ?.map((commit) => {
          const { file, diff, additions, deletions } = commit || {
            file: '',
            diff: '',
            additions: 0,
            deletions: 0,
          }
          return isLoading ? (
            <Skeleton />
          ) : (
            <DiffBox
              key={file}
              {...{ isLoaded: !isLoading, oid: '', filepath: file, deletions, additions }}
            >
              [<ParsedDiff {...{ diff, truncated: true }} />]
            </DiffBox>
          )
        })}
    </>
  )
}

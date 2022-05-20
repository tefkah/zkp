import { Skeleton } from '@chakra-ui/react'
// TODO: Port diffs to MDX
import { ParsedDiff } from '../../services/thesis/parseDiff'
import { DiffBox } from '../Diff'

export const ParsedCommit = (props: { [key: string]: any }) => {
  const { commitData, isLoading } = props
  return commitData?.map((commit: any) => {
    if (!commit) return null
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
        key={file.filepath}
        {...{ isLoaded: !isLoading, oid: '', filepath: file, deletions, additions }}
      >
        [<ParsedDiff {...{ diff, truncated: true }} />]
      </DiffBox>
    )
  })
}

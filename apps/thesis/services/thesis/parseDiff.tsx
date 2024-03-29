// Parse a diff baby

import { Change } from 'diff'
import { FileDiff } from '@zkp/types'
import { ParsedOrg } from './parseOrg'

interface Props {
  diff: FileDiff | string
}

export const diffToString = (diffs: FileDiff) => {
  if (!diffs) {
    return ''
  }

  return diffs.diff
    .map((diff: Change) => {
      const { added, removed, value } = diff

      if (!added && !removed) return value

      const begin = diff.added ? '\n\n#+begin_addition\n\n' : '\n\n#+begin_deletion\n\n'
      const end = diff.added ? '\n\n#+end_addition\n\n' : '\n\n#+end_deletion\n\n'
      return `${begin}${diff.value}${end}`
    })
    .join('')
}

export const ParsedDiff = (props: Props) => {
  const { diff } = props
  const diffString = typeof diff === 'string' ? diff : diffToString(diff)
  // TODO: Separate fake from real ids
  return <ParsedOrg currentId="AAA FAKE ID" text={diffString} />
}

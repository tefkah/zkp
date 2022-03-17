// Parse a diff baby

import { Box } from '@chakra-ui/react'
import { Change } from 'diff'
import React, { ReactNode } from 'react'
import { FileDiff } from '../../lib/api'
import { ParsedOrg } from './parseOrg'

interface Props {
  diff: FileDiff
  truncated: boolean
}

export const diffToString = (diff: FileDiff) => {
  if (!diff) {
    return ''
  }

  return diff.diff
    .map((diff: Change) => {
      const begin = diff.added
        ? '\n\n#+begin_addition\n\n'
        : diff.removed
        ? '\n\n#+begin_deletion\n\n'
        : ''
      const end = diff.added
        ? '\n\n#+end_addition\n\n'
        : diff.removed
        ? '\n\n#+end_deletion\n\n'
        : ''
      return `${begin}${diff.value}${end}`
    })
    .join('')
}

export default function ParsedDiff(props: Props) {
  const { diff } = props
  const diffString = typeof diff === 'string' ? diff : diffToString(diff)
  // TODO: Separate fake from real ids
  return (
    <Box>
      <ParsedOrg currentId="AAA FAKE ID" text={diffString} />
    </Box>
  )
}

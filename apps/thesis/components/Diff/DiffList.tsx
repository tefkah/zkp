import { VStack, Button } from '@chakra-ui/react'
import { useState, useMemo } from 'react'
import { IndiviualFileDiff } from './IndividualFileDiff'

interface DiffListProps {
  relevantFiles: string[]
  commits: string[]
}

export const DiffList = (props: DiffListProps) => {
  const { relevantFiles, commits } = props
  // const [diffs, setDiffs] = useState<any[]>([])
  const [diffsToLoad, setDiffsToLoad] = useState([0, 5])

  const diffs = useMemo(
    () => [
      relevantFiles
        .slice(diffsToLoad[0], diffsToLoad[1])
        .map((file: string) => <IndiviualFileDiff key={file} {...{ commits, file }} />),
    ],
    [diffsToLoad, commits, relevantFiles],
  )

  return (
    <VStack w="full" spacing={6}>
      {diffs}
      {diffsToLoad[1] < relevantFiles.length && (
        <Button
          onClick={() =>
            setDiffsToLoad((curr: number[]) => [
              curr[1],
              Math.min(relevantFiles.length, curr[1] + 5),
            ])
          }
        >
          Load More
        </Button>
      )}
    </VStack>
  )
}

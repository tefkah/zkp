import { VStack, Button } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { IndiviualFileDiff } from '../../pages/compare/[...commit]'

interface DiffListProps {
  relevantFiles: string[]
  commit: any
}

export const DiffList = (props: DiffListProps) => {
  const { relevantFiles, commit } = props
  const [diffs, setDiffs] = useState<any[]>([])
  const [diffsToLoad, setDiffsToLoad] = useState([0, 5])

  useEffect(() => {
    setDiffs((curr: any) => [
      ...curr,
      relevantFiles
        .slice(diffsToLoad[0], diffsToLoad[1])
        .map((file: string) => <IndiviualFileDiff key={file} {...{ commit, file }} />),
    ])
  }, [diffsToLoad])
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

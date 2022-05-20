import { Text } from '@chakra-ui/react'
import { ParsedCommit } from '../Commits'
import { useFetch } from '../../utils/useFetch'

interface IndiviualFileDiffProps {
  commits: string[]
  file: string
}

export const IndiviualFileDiff = (props: IndiviualFileDiffProps) => {
  const { commits, file } = props
  const [commit1, commit2] = commits
  const { data, isLoading, isError } = useFetch(
    `/api/diff/${commit1}/${commit2}/${encodeURIComponent(file)}`,
  )

  if (isError) return <Text>Oopsie whoopsie! We did a fucky wucky!</Text>

  return <ParsedCommit isLoading={isLoading} commitData={data} />
}

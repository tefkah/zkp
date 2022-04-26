import { Text } from '@chakra-ui/react'
import { ParsedCommit } from '../../pages/compare/[...commit]'
import { useFetch } from '../../utils/useFetch'

interface IndiviualFileDiffProps {
  commit: string[]
  file: string
}
export const IndiviualFileDiff = (props: IndiviualFileDiffProps) => {
  const { commit, file } = props
  const [commit1, commit2] = commit
  const { data, isLoading, isError } = useFetch(
    `/api/diff/${commit1}/${commit2}/${encodeURIComponent(file)}`,
  )

  if (isError) return <Text>Oopsie whoopsie! We did a fucky wucky!</Text>

  return <ParsedCommit isLoading={isLoading} commitData={data} />
}

import { getCommits, tryReadJSON } from '../../utils/getListOfCommitsWithStats'
import { Commit } from '../../api'
import { Box, Container, Flex, Spinner, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import ParsedDiff from '../../server/parseDiff'
import useFetch from '../../utils/useFetch'
import { commit } from 'isomorphic-git'
import { DiffBox } from '../../components/DiffBox'
import useSWR from 'swr'
import fetcher from '../../utils/fetcher'
import { join } from 'path'

export function ParsedCommit(props: { [key: string]: any }) {
  const { commitData } = props
  return (
    <>
      {commitData?.map((commit: any) => {
        if (!commit) return null
        const { file, diff } = commit
        const orgText = ParsedDiff({ diff, truncated: true })
        console.log(orgText)
        return (
          <DiffBox key={file.filepath} {...{ oid: '', filepath: file, deletions: 0, additions: 0 }}>
            {orgText}
          </DiffBox>
        )
      })}
    </>
  )
}

interface FileCommit {
  oid: string
  files: string[]
}
interface Props {
  commit: string[]
  relevantFiles: string[]
}

interface IndiviualFileDiffProps {
  commit: string[]
  file: string
}
const IndiviualFileDiff = (props: IndiviualFileDiffProps) => {
  const { commit, file } = props
  const [commit1, commit2] = commit
  const { data, isLoading, isError } = useFetch(`api/diff/${commit1}/${commit2}/${file}`)

  useEffect(() => {
    console.log(data)
  }, [data, isError])
  if (isLoading) return <Spinner />

  if (isError) return <Text>Oopsie whoopsie! We did a fucky wucky!</Text>
  console.log(data)

  return <ParsedCommit commitData={data} />
}

export default function AAAA(props: Props) {
  const { commit, relevantFiles } = props

  const [commit1, commit2] = commit
  //const {data:parsedText, isLoading} = useFetch(e)

  return (
    <Container>
      <Text>this should be a static page, which shows all the files CHANGED at this commit.</Text>
      <Text>
        Each of the files at this commit should be a file which shows the differences between this
        commit and the last.
      </Text>
      <Text>
        There should also be an option to view ALL the files at this commit, but this should not be
        static (would be too much to keep track of, not worth it.
      </Text>
      <Text>Actually, I don't see anyone really use that, we don't need that.</Text>
      <Box>
        {relevantFiles.map((file: string) => (
          <IndiviualFileDiff key={file} {...{ commit, file }} />
        ))}
      </Box>
    </Container>
  )
}

export interface StaticProps {
  params: { commit: string }
}
export async function getServerSideProps(props: StaticProps) {
  const { commit } = props.params
  const cwd = process.cwd()
  const commitList = await tryReadJSON(join(cwd, 'data', 'gitFiles.json'))

  let isRelevantCommit = false
  const relevantFiles = commitList.reduceRight((acc: string[], curr: FileCommit) => {
    if (isRelevantCommit && commit.includes(curr.oid)) {
      isRelevantCommit = false
      acc.push(...curr.files)
      return acc
    }

    if (!isRelevantCommit && commit.includes(curr.oid)) {
      isRelevantCommit = true
    }
    if (!isRelevantCommit) return acc

    acc.push(...curr.files)
    return acc
  }, [])
  // console.log(relevantFiles)

  return { props: { commit, relevantFiles } }
}

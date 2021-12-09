import {
  consolidateCommitsPerDay,
  getCommits,
  tryReadJSON,
} from '../../utils/getListOfCommitsWithStats'
import { Commit } from '../../api'
import {
  Box,
  Container,
  Flex,
  HStack,
  Icon,
  IconButton,
  Link,
  Spinner,
  Text,
  Tooltip,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import ParsedDiff from '../../server/parseDiff'
import useFetch from '../../utils/useFetch'
import { commit } from 'isomorphic-git'
import { DiffBox } from '../../components/Diff/DiffBox'
import useSWR from 'swr'
import fetcher from '../../utils/fetcher'
import { join } from 'path'
import Header from '../../components/Header'
import { format } from 'date-fns'
import { IoIosGitCompare } from 'react-icons/io'
import { GoMarkGithub } from 'react-icons/go'

import { CommitList } from '../../components/Commits/CommitList'

export function ParsedCommit(props: { [key: string]: any }) {
  const { commitData } = props
  return (
    <>
      {commitData?.map((commit: any) => {
        if (!commit) return null
        const { file, diff, additions, deletions } = commit
        const orgText = ParsedDiff({ diff, truncated: true })
        console.log(orgText)
        return (
          <DiffBox key={file.filepath} {...{ oid: '', filepath: file, deletions, additions }}>
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
  message: string
  date: number
}
interface Props {
  commit: string[]
  relevantFiles: string[]
  commitsPerDate: any
}

interface IndiviualFileDiffProps {
  commit: string[]
  file: string
  //messages: string[]
  // dates: number[]
}
const IndiviualFileDiff = (props: IndiviualFileDiffProps) => {
  const { commit, file } = props
  const [commit1, commit2] = commit
  const { data, isLoading, isError } = useFetch(
    `/api/diff/${commit1}/${commit2}/${encodeURIComponent(file)}`,
  )

  if (isLoading) return <Spinner />

  if (isError) return <Text>Oopsie whoopsie! We did a fucky wucky!</Text>
  console.log(data)

  return <ParsedCommit commitData={data} />
}

export default function ComparePage(props: Props) {
  const { commit, relevantFiles, commitsPerDate } = props

  const [commit1, commit2] = commit
  //const {data:parsedText, isLoading} = useFetch(e)
  const headerColor = useColorModeValue('gray.50', 'gray.700')
  const bodyColor = useColorModeValue('white', 'gray.800')

  return (
    <>
      <Header />

      <VStack mx="5%" mt={20}>
        <Flex w="full" justifyContent="space-between" flexDirection="column">
          <Flex
            borderTopRadius="xl"
            borderWidth={1}
            borderColor="grey.500"
            backgroundColor={headerColor}
            py={2}
            px={4}
            justifyContent="space-between"
            alignItems="center"
          >
            <Flex flexDir="column">
              <Text fontWeight="bold">
                {commit1} vs {commit2}
              </Text>
              <Text>{format(new Date(1 * 1000), "MMMM do, yyyy 'at' hh:mm")}</Text>
            </Flex>
            <HStack display="flex" alignItems="center">
              <Tooltip label="Compare with another commit">
                <IconButton
                  icon={<IoIosGitCompare />}
                  aria-label="Compare with another commit"
                  variant="ghost"
                  colorScheme="white"
                />
              </Tooltip>
              <Tooltip label="View on GitHub">
                <Link
                  href={`https://github.com/ThomasFKJorna/thesis-writing/compare/${commit1}...${commit2}`}
                >
                  <Icon as={GoMarkGithub} />
                </Link>
              </Tooltip>
            </HStack>
          </Flex>
          <HStack
            borderBottomRadius="xl"
            borderWidth={1}
            borderColor="grey.500"
            py={2}
            px={4}
            display="flex"
            alignItems="flex-end"
          >
            <Text as="samp" variant="">{`Commit ....`}</Text>
          </HStack>
        </Flex>
        <Box w="full" pl={4} pt={10}>
          <Text>
            Showing{' '}
            <Text as="span" fontWeight="bold">
              {relevantFiles.length} changed {relevantFiles.length > 1 ? 'files' : 'file'}.
            </Text>{' '}
          </Text>
        </Box>
        <Box w="100vw">
          <CommitList commitLog={commitsPerDate} />
        </Box>
        <VStack w="full" spacing={6}>
          {relevantFiles.map((file: string) => (
            <IndiviualFileDiff key={file} {...{ commit, file }} />
          ))}
        </VStack>
      </VStack>
    </>
  )
}

export interface StaticProps {
  params: { commit: string }
}
export async function getServerSideProps(props: StaticProps) {
  const { readFile } = require('fs').promises
  const { resolve, join } = require('path')
  const { commit } = props.params
  const dataDir = resolve(process.cwd(), 'data')
  const slimJSONLocation = join(dataDir, 'gitSlim.json')

  const commitList = JSON.parse(await readFile(slimJSONLocation, { encoding: 'utf8' }))

  let isRelevantCommit = false
  const { files: relevantFiles, commits } = commitList.reduceRight(
    (acc: { [key: string]: (string | FileCommit)[] }, curr: FileCommit) => {
      if (isRelevantCommit && commit.includes(curr.oid)) {
        isRelevantCommit = false
        acc.files.push(...curr.files)
        acc.commits.push(curr)
        return acc
      }

      if (!isRelevantCommit && commit.includes(curr.oid)) {
        isRelevantCommit = true
      }
      if (!isRelevantCommit) return acc

      acc.files.push(...curr.files)
      acc.commits.push(curr)
      return acc
    },
    { files: [], commits: [] },
  )
  const commitsPerDate = consolidateCommitsPerDay(commits)

  return { props: { commit, relevantFiles, commitsPerDate } }
}

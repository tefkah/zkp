import {
  Box,
  Flex,
  HStack,
  Icon,
  IconButton,
  Link,
  Skeleton,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react'
import React, { ReactElement } from 'react'
import { format } from 'date-fns'
import { IoIosGitCompare } from 'react-icons/io'
import { GoMarkGithub } from 'react-icons/go'
import { ParsedDiff } from '../../services/thesis/parseDiff'
import { consolidateCommitsPerDay } from '../../utils/getListOfCommitsWithStats'

import { CommitList } from '../../components/Commits'
import { BasicLayout } from '../../components/Layouts'
import { DiffList, DiffBox } from '../../components/Diff'

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

export const ComparePage = (props: Props) => {
  const { commit, relevantFiles, commitsPerDate } = props

  const [commit1, commit2] = commit
  const headerColor = 'back'

  return (
    <VStack mx={{ base: '5%', md: '15%' }} my={20}>
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
          <Text as="samp">Commit ....</Text>
        </HStack>
      </Flex>
      <Box w="full" pl={4} pt={10}>
        <Text>
          Showing{' '}
          <Text as="span" fontWeight="bold">
            {relevantFiles.length}
            {' changed '}
            {relevantFiles.length > 1 ? 'files' : 'file'}.
          </Text>
        </Text>
      </Box>
      <Box w="full">
        <CommitList commitLog={commitsPerDate} />
      </Box>
      <DiffList {...{ relevantFiles, commit }} />
    </VStack>
  )
}

export default ComparePage
export interface StaticProps {
  params: { commit: string }
}
export const getServerSideProps = async (props: StaticProps) => {
  const { readFile } = require('fs').promises
  const { resolve, join } = require('path')
  const { commit } = props.params
  const dataDir = resolve(process.cwd(), 'data')
  const slimJSONLocation = join(dataDir, 'gitSlim.json')

  const commitList = JSON.parse(await readFile(slimJSONLocation, { encoding: 'utf8' }))

  let isRelevantCommit = false
  const { files: relevantFiles, commits } = commitList.reduceRight(
    (acc: { [key: string]: (string | FileCommit)[] }, curr: FileCommit) => {
      if (isRelevantCommit && commit?.includes(curr.oid)) {
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

ComparePage.getLayout = (page: ReactElement) => <BasicLayout>{page}</BasicLayout>
import { getCommits, tryReadJSON } from '../../utils/getListOfCommitsWithStats'
import { Commit } from '../../api'
import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Icon,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useColorMode,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import ParsedDiff from '../../server/parseDiff'
import useFetch from '../../utils/useFetch'
import { commit } from 'isomorphic-git'
import { DiffBox } from '../../components/Diff/DiffBox'
import { join } from 'path'
import Header from '../../components/Header'
import { GoMarkGithub } from 'react-icons/go'
import { IoIosGitCompare } from 'react-icons/io'
import { format } from 'date-fns'

export function parseCommits(commitData: Commit) {
  return commitData?.files?.map((file) => {
    if (!file) return
    const { additions, deletions, filepath, oid } = file
    const orgText = ParsedDiff({ diff: file, truncated: true })
    return (
      <DiffBox key={file.filepath} {...{ oid, filepath, deletions, additions }}>
        {orgText}
      </DiffBox>
    )
  })
}

interface Props {
  commitData: Commit
}
export default function CommitPage(props: Props) {
  const { commitData } = props
  const { oid, deletions, additions, message, date } = commitData

  //const {data:parsedText, isLoading} = useFetch(e)

  const headerColor = useColorModeValue('gray.50', 'gray.700')
  const bodyColor = useColorModeValue('white', 'gray.800')
  const parsedText = parseCommits(commitData)

  return (
    <>
      <Header />
      <VStack mx="5%" marginTop={20}>
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
              <Text fontWeight="bold">{message}</Text>
              <Text>{format(new Date(date * 1000), "MMMM do, yyyy 'at' hh:mm")}</Text>
            </Flex>
            <HStack spacing={2} display="flex" alignItems="top">
              <Menu>
                <MenuButton size="sm" variant="ghost" as={Button} rightIcon={<IoIosGitCompare />}>
                  Compare
                </MenuButton>
                <MenuList>
                  <MenuItem>Last 7 days</MenuItem>
                  <MenuItem>Last month</MenuItem>
                  <MenuItem>Custom</MenuItem>
                </MenuList>
              </Menu>
              <Tooltip label="View on GitHub">
                <Link href={`https://github.com/ThomasFKJorna/thesis-writing/commit/${oid}`}>
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
            <Text as="samp" variant="">{`Commit ${oid}`}</Text>
          </HStack>
        </Flex>
        <Box w="full" pl={4} pt={10}>
          <Text>
            Showing{' '}
            <Text as="span" fontWeight="bold">
              {parsedText.length} changed {parsedText.length > 1 ? 'files' : 'file'}
            </Text>{' '}
            with
            <Text
              as="span"
              fontWeight="bold"
              color="green.500"
            >{` ${additions} added words `}</Text>
            and
            <Text
              as="span"
              fontWeight="bold"
              color="red.500"
            >{` ${deletions} removed words.`}</Text>
          </Text>
        </Box>
        <VStack spacing={6} w="full">
          {parsedText}
        </VStack>
      </VStack>
    </>
  )
}

export async function getStaticPaths() {
  const commitList = await getCommits()
  const commitIndexList = commitList.map((commit) => ({ params: { commit: commit.oid } }))
  return {
    paths: commitIndexList,
    fallback: false,
  }
}

export interface StaticProps {
  params: { commit: string }
}
export async function getStaticProps(props: StaticProps) {
  const { commit } = props.params

  const cwd = process.cwd()
  const commits = await tryReadJSON(join('data', 'git.json'))
  //const commits = await tryReadJSON('data/git.json')

  console.log(commits)
  const commitData =
    commits.filter((c: Commit) => {
      return c.oid === commit
    })?.[0] || {}

  return { props: { commitData } }
}

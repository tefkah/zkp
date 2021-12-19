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
import React, { ReactElement, useEffect, useState } from 'react'
import ParsedDiff from '../../server/parseDiff'
import useFetch from '../../utils/useFetch'
import { commit } from 'isomorphic-git'
import { DiffBox } from '../../components/Diff/DiffBox'
import { join } from 'path'
import Header from '../../components/Header'
import { GoMarkGithub } from 'react-icons/go'
import { IoIosGitCompare } from 'react-icons/io'
import { format } from 'date-fns'
import Footer from '../../components/Footer'
import { Giscus } from '@giscus/react'
import Head from 'next/head'
import BasicLayout from '../../components/Layouts/BasicLayout'

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
  const [messageTitle, ...messageBody] = message.split('\n')

  //const {data:parsedText, isLoading} = useFetch(e)

  const headerColor = useColorModeValue('gray.50', 'gray.700')
  const bodyColor = useColorModeValue('white', 'gray.800')
  const parsedText = parseCommits(commitData)

  const formattedDate = format(new Date(date * 1000), "MMMM do, yyyy 'at' hh:mm")
  return (
    <>
      <Head>
        <title>{messageTitle}</title>
        <meta name="description" content={`Commit ${oid} at ${formattedDate}`} />
      </Head>
      <VStack mx={{ base: '5%', md: '20%' }} my={20}>
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
              <Text fontWeight="bold">{messageTitle}</Text>
              <Text>{formattedDate}</Text>
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
          <Box borderBottomRadius="xl" borderWidth={1} borderColor="grey.500" py={2} px={4}>
            {messageBody && <Text>{messageBody}</Text>}
            <HStack display="flex" alignItems="flex-end">
              <Text as="samp" variant="">{`Commit ${oid}`}</Text>
            </HStack>
          </Box>
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
              color="primary"
            >{` ${deletions} removed words.`}</Text>
          </Text>
        </Box>
        <VStack spacing={6} w="full">
          {parsedText}
        </VStack>

        <Container>
          <Giscus
            repo="ThomasFKJorna/thesis-writing"
            repoId="R_kgDOGVpQ7Q"
            category="General"
            category-id="DIC_kwDOGVpQ7c4CAQYS"
            mapping="title"
            reactionsEnabled="1"
            emitMetadata="1"
            theme={useColorModeValue('light', 'dark')}
          />
        </Container>
      </VStack>
    </>
  )
}

export async function getStaticPaths() {
  const commitList = await getCommits()
  const commitIndexList = commitList
    .filter(
      (commit) =>
        ![
          '72031577baf73d00536f369657a4bc9c8c5518f0',
          '8a8d96b1a6ae75dd17f7462c31695823189f6f14',
        ].includes(commit.oid),
    )
    .map((commit) => ({ params: { commit: commit.oid } }))
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

  const commits = await tryReadJSON(join('data', 'git.json'))
  //const commits = await tryReadJSON('data/git.json')

  const commitData =
    commits.filter((c: Commit) => {
      return c.oid === commit
    })?.[0] || {}

  return { props: { commitData } }
}

CommitPage.getLayout = function getLayout(page: ReactElement) {
  return <BasicLayout>{page}</BasicLayout>
}

import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Icon,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react'
import { ReactElement } from 'react'
import { join } from 'path'
import { GoMarkGithub } from 'react-icons/go'
import { IoIosGitCompare } from 'react-icons/io'
import { format } from 'date-fns'
import Head from 'next/head'
import { Commit } from '@zkp/types'
import { Giscus } from '@zkp/discus'
import { DATA_DIR } from '@zkp/paths'
import { getCommits, tryReadJSON } from '@zkp/git'
import { DiffBox } from '../../components/Diff/DiffBox'
import { ParsedDiff } from '../../services/thesis/parseDiff'
import { BasicLayout } from '../../components/Layouts/BasicLayout'

export const ParsedCommits = (commitData: Commit) =>
  commitData?.files?.map((file) => {
    if (!file) return null
    const { additions, deletions, filepath, oid } = file
    const orgText = ParsedDiff({ diff: file })
    return (
      <DiffBox key={file.filepath} {...{ oid, filepath, deletions, additions }}>
        {[orgText]}
      </DiffBox>
    )
  })

interface Props {
  commitData: Commit
}
export const CommitPage = (props: Props) => {
  const { commitData } = props
  const { oid, deletions, additions, message, date } = commitData
  const [messageTitle, ...messageBody] = message?.split('\n') || ['']

  // const {data:parsedText, isLoading} = useFetch(e)

  const headerColor = 'back'
  const parsedText = ParsedCommits(commitData)

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
              <Text as="samp">{`Commit ${oid}`}</Text>
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
            // repoId="R_kgDOGVpQ7Q"
            category="General"
            category-id="DIC_kwDOGVpQ7c4CAQYS"
            term={messageTitle}
            // reactionsEnabled="1"
            // emitMetadata="1"
            // theme={useColorModeValue('light', 'dark')}
          />
        </Container>
      </VStack>
    </>
  )
}

export const getStaticPaths = async () => {
  const commitList = await getCommits()
  const commitIndexList = commitList.map((commit) => ({ params: { commit: commit.oid } }))
  return {
    paths: commitIndexList,
    fallback: 'blocking',
  }
}

export interface StaticProps {
  params: { commit: string }
}

export const getStaticProps = async (props: StaticProps) => {
  const { commit } = props.params

  const commits = await tryReadJSON(join(DATA_DIR, 'git.json'))
  // const commits = await tryReadJSON('data/git.json')

  const commitData = commits.filter((c: Commit) => c.oid === commit)?.[0] || {}

  return { props: { commitData } }
}

CommitPage.getLayout = (page: ReactElement) => <BasicLayout>{page}</BasicLayout>

export default CommitPage

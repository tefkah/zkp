import {
  Text,
  Container,
  Heading,
  useColorModeValue,
  VStack,
  HStack,
  Box,
  LinkBox,
  LinkOverlay,
  Skeleton,
} from '@chakra-ui/react'
import { format, formatDistance, parse, parseISO } from 'date-fns'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import Link from 'next/link'
import { join } from 'path'
import React from 'react'
import { FaGithub } from 'react-icons/fa'
import useSWR from 'swr'
import { ViewGithub } from '../../components/Buttons/ViewGithub'
import BasicLayout from '../../components/Layouts/BasicLayout'

export interface Discussions {
  title: string
  number: number
  comment: string
  link?: string
}
interface Props {
  discussions: Discussions[]
}

export default function DiscussionsPage(props: Props) {
  // const { discussions } = props
  const { data: sesh } = useSession()
  const { accessToken } = sesh!

  const { data, error } = useSWR(
    'https://api.github.com/graphql',
    async () =>
      await fetch('https://api.github.com/graphql', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        method: 'POST',
        body: JSON.stringify({
          variables: {
            repo: 'ThomasFKJorna/thesis-discussions',
          },
          query:
            '# Type queries into this side of the screen, and you will \n# see intelligent typeaheads aware of the current GraphQL type schema, \n# live syntax, and validation errors highlighted within the text.\n\n# We\'ll get you started with a simple query showing your username!\nquery {\n repository(owner: "ThomasFKJorna", name: "thesis-discussions") {\n discussions(first: 10) {\n # type: DiscussionConnection\n totalCount # Int!\n\n pageInfo {\n # type: PageInfo (from the public schema)\n startCursor\n endCursor\n hasNextPage\n hasPreviousPage\n }\n\n edges {\n # type: DiscussionEdge\n cursor\n node {\n # type: Discussion\n title\n updatedAt\n id\n \n number\n body }\n }\n\n }\n }\n}',
        }),
      }).then((res) => res.json()),
  )
  return (
    <>
      <Head>
        <title>Discussions | Thomas' Thesis</title>
      </Head>
      <Box minH="100vh" mt={20} mb={10}>
        <VStack spacing={10}>
          <Container>
            <Heading>Discussions</Heading>
            <ViewGithub
              text="View discussions on GitHub"
              repo="thesis-discussions"
              slug="discussions"
            />
          </Container>
          <VStack w="full" spacing={5}>
            {!data || error ? (
              <Skeleton />
            ) : (
              data.data.repository.discussions.edges.map((discussion: any) => {
                const { title, updatedAt, category, body, number } = discussion.node
                return (
                  <LinkBox
                    borderWidth={1}
                    key={title}
                    borderRadius="sm"
                    as={Container}
                    py={2}
                    transition="color 0.2s"
                    _hover={{ color: 'primary' }}
                  >
                    <Heading size="md" fontWeight="600">
                      <Link passHref href={`/discussions/${number}`}>
                        <LinkOverlay>{title}</LinkOverlay>
                      </Link>
                    </Heading>
                    <Text>{body}</Text>
                    <Text size="xs" color="gray.500">
                      Updated {formatDistance(parseISO(updatedAt), new Date(), { addSuffix: true })}
                    </Text>
                  </LinkBox>
                )
              })
            )}
          </VStack>
        </VStack>
      </Box>
    </>
  )
}

DiscussionsPage.getLayout = function (page: React.ReactElement) {
  return <BasicLayout>{page}</BasicLayout>
}

DiscussionsPage.auth = true

export async function getServerSideProps() {
  const fs = require('fs')
  const cwd = process.cwd()
  const discussions = JSON.parse(
    await fs.promises.readFile(join(cwd, 'notes', 'discussions.json'), { encoding: 'utf8' }),
  )

  return { props: { discussions } }
}

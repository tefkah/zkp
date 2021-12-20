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
  Tooltip,
} from '@chakra-ui/react'
import { format, formatDistance, parse, parseISO } from 'date-fns'
import { getSession } from 'next-auth/react'
import Head from 'next/head'
import Link from 'next/link'
import { join } from 'path'
import React from 'react'
import { ViewGithub } from '../../components/Buttons/ViewGithub'
import { NewDiscussion } from '../../components/discs/NewDiscussion'
import BasicLayout from '../../components/Layouts/BasicLayout'
import { useDiscussion } from '../../hooks/useDiscussion'
import { CategoryData, CATEGORY_LIST_QUERY } from '../../queries/getDiscussion'
import makeGenericGraphQlRequest from '../../queries/makeGenericGraphQLRequest'

export interface Discussions {
  title: string
  number: number
  comment: string
  link?: string
}
interface Props {
  access: boolean
  discussionCategories?: CategoryData
}

export default function DiscussionsPage(props: Props) {
  // const { discussions } = props
  const { access, discussionCategories } = props

  const { data, isLoading, error } = useDiscussion({
    first: 10,
    repo: 'thomasfkjorna/thesis-discussions',
    term: '',
    category: '',
    list: true,
  })
  !access && window.location.replace('/')

  return (
    <>
      {access && (
        <>
          <Head>
            <title>Discussions | Thomas' Thesis</title>
          </Head>
          <Box minH="100vh" mt={{ base: 4, md: 16 }} mb={10}>
            <VStack px={{ base: '4%', md: '10%' }} w="full" alignItems="flex-start" spacing={10}>
              <Box w="full">
                <HStack justifyContent="space-between" w="full">
                  <Box>
                    <Heading>Discussions</Heading>
                    <ViewGithub
                      text="View discussions on GitHub"
                      repo="thesis-discussions"
                      slug="discussions"
                    />
                  </Box>
                  <NewDiscussion {...{ discussionCategories }} />
                </HStack>
              </Box>
              <Box>
                <VStack w="full" alignItems="flex-start" spacing={5}>
                  {isLoading && !data ? (
                    <Skeleton />
                  ) : (
                    data?.data?.repository.discussions.edges.map((discussion: any) => {
                      const {
                        title,
                        updatedAt,
                        body,
                        number,
                        category: { emojiHTML, description, name },
                      } = discussion.node
                      return (
                        <LinkBox
                          borderWidth={1}
                          key={title}
                          borderRadius="md"
                          as={Container}
                          maxW="container.md"
                          py={2}
                          transition="color 0.2s"
                          _hover={{
                            color: 'primary',
                            backgroundColor: useColorModeValue('gray.50', 'gray.600'),
                          }}
                        >
                          <HStack w="full" alignItems="center" justifyContent="space-between">
                            <Heading size="md" fontWeight="600">
                              <Link passHref href={`/discussions/${number}`}>
                                <LinkOverlay>{title}</LinkOverlay>
                              </Link>
                            </Heading>
                            <Box>
                              <Tooltip label={description}>
                                <HStack borderRadius="xl" bg="gray.100" p={1}>
                                  <Box dangerouslySetInnerHTML={{ __html: emojiHTML }}></Box>
                                  <Text>{name}</Text>
                                </HStack>
                              </Tooltip>
                            </Box>
                          </HStack>
                          <Text>{body}</Text>
                          <Text size="2xs" color="gray.500">
                            Updated{' '}
                            {formatDistance(parseISO(updatedAt), new Date(), { addSuffix: true })}
                          </Text>
                        </LinkBox>
                      )
                    })
                  )}
                </VStack>
              </Box>
            </VStack>
          </Box>
        </>
      )}
    </>
  )
}

DiscussionsPage.getLayout = function (page: React.ReactElement) {
  return <BasicLayout>{page}</BasicLayout>
}

DiscussionsPage.auth = true

export async function getServerSideProps(context) {
  const session = await getSession(context)
  const token = (session?.accessToken as string) || ''
  if (!token) return { props: { access: false } }
  if (!process.env.ALLOWED_EMAILS?.includes(session?.user?.email as string))
    return { props: { access: false } }

  const discussionCategories = await makeGenericGraphQlRequest({
    post: true,
    request: CATEGORY_LIST_QUERY,
    token,
  })
  console.log(discussionCategories)

  return { props: { access: true, discussionCategories } }
}

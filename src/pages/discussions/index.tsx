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
  Spinner,
  Icon,
  Divider,
} from '@chakra-ui/react'
import { format, formatDistance, parse, parseISO } from 'date-fns'
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import Head from 'next/head'
import Link from 'next/link'
import { join } from 'path'
import React from 'react'
import { ViewGithub } from '../../components/Buttons/ViewGithub'
import { NewDiscussion } from '../../components/discs/NewDiscussion'
import BasicLayout from '../../components/Layouts/BasicLayout'
import { useDiscussion } from '../../hooks/useDiscussion'
import { CategoryData, CATEGORY_LIST_QUERY, CommentEdge } from '../../queries/getDiscussion'
import makeGenericGraphQlRequest from '../../queries/makeGenericGraphQLRequest'
import { useCookies } from 'react-cookie'
import { CircleIcon, CommentDiscussionIcon, DotIcon } from '@primer/octicons-react'
import { VscCircleFilled } from 'react-icons/vsc'

export interface Discussions {
  title: string
  number: number
  comment: string
  link?: string
}
interface Props {
  access: boolean
  discussionCategories?: CategoryData
  token?: string
}

export default function DiscussionsPage(props: Props) {
  // const { discussions } = props
  const { access, token, discussionCategories } = props

  const { data, isLoading, error } = useDiscussion({
    first: 10,
    repo: 'thomasfkjorna/thesis-discussions',
    term: '',
    category: '',
    list: true,
  })
  !access && window.location.replace('/')

  const [cookies, setCookie] = useCookies(['visit'])
  if (!cookies.visit) setCookie('visit', {})

  const light = useColorModeValue('gray.100', 'gray.700')
  const lighter = useColorModeValue('gray.50', 'gray.700')
  const text = useColorModeValue('gray.500', 'gray.200')
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
                  {discussionCategories && token && (
                    <NewDiscussion {...{ token, discussionCategories }} />
                  )}
                </HStack>
              </Box>
              <VStack w="full" alignItems="flex-start" spacing={5} divider={<Divider />}>
                {isLoading && !data ? (
                  <Spinner />
                ) : (
                  // @ts-expect-error
                  data?.data?.repository.discussions.edges.map((discussion: any) => {
                    const {
                      title,
                      updatedAt,
                      body,
                      number,
                      comments,
                      category: { emojiHTML, description, name },
                    } = discussion.node
                    const isUpdated = !(
                      (parseISO(cookies.visit?.[title]?.lastVisit || '') || 0) > parseISO(updatedAt)
                    )
                    const totalReplyCount = comments.edges.reduce(
                      (total: number, edge: CommentEdge) =>
                        total + edge?.node?.replies?.totalCount || 0,
                      0,
                    )
                    const totalCommentsandReplies = comments.totalCount + totalReplyCount

                    const newComments =
                      comments.totalCount - (cookies.visit[title]?.commentCount || 0)
                    const newReplies = totalReplyCount - (cookies.visit[title]?.replyCount || 0)
                    const newCommentsandReplies =
                      totalCommentsandReplies - (cookies.visit[title]?.totalCount || 0)
                    return (
                      <Box w="full">
                        <LinkBox
                          w="full"
                          p={4}
                          as={VStack}
                          alignItems="flex-start"
                          // borderWidth={1}
                          key={title}
                          borderRadius="md"
                          transition="color 0.2s"
                          _hover={{
                            color: 'primary',
                            backgroundColor: lighter,
                          }}
                        >
                          <HStack w="full" alignItems="center" justifyContent="space-between">
                            <HStack alignItems="baseline">
                              <Heading maxW="60ch" size="md" fontWeight="600">
                                <Link passHref href={`/discussions/${title}`}>
                                  <LinkOverlay>{title}</LinkOverlay>
                                </Link>
                              </Heading>
                              {isUpdated && (
                                <Box>
                                  <Icon mb={1} as={VscCircleFilled} color="primary" />
                                </Box>
                              )}
                            </HStack>
                            <Box>
                              <Tooltip label={description}>
                                <HStack
                                  borderWidth={1}
                                  py="2px"
                                  borderRadius="2xl"
                                  bg={light}
                                  px={3}
                                >
                                  <Box
                                    fontSize="sm"
                                    dangerouslySetInnerHTML={{ __html: emojiHTML }}
                                  ></Box>
                                  <Text fontSize="sm" color={text} fontWeight="semibold">
                                    {name}
                                  </Text>
                                </HStack>
                              </Tooltip>
                            </Box>
                          </HStack>
                          <HStack alignItems="baseline" w="full" justifyContent="space-between">
                            <Box>
                              <Container py={2} px={0}>
                                {body}
                              </Container>
                            </Box>
                            <HStack alignItems="center">
                              <Text>{totalCommentsandReplies}</Text>
                              <Box>
                                <Icon as={CommentDiscussionIcon} />
                              </Box>
                            </HStack>
                          </HStack>
                          <HStack
                            alignItems="bottom"
                            spacing={4}
                            w="full"
                            justifyContent="space-between"
                          >
                            <Text fontSize="sm" color="gray.500">
                              Updated{' '}
                              {formatDistance(parseISO(updatedAt), new Date(), { addSuffix: true })}
                            </Text>
                            <VStack
                              color="gray.400"
                              fontWeight="semibold"
                              alignItems="flex-end"
                              spacing={0}
                            >
                              {newComments && (
                                <Text fontSize="xs">{`${newComments} new ${
                                  newComments > 1 ? 'comments' : 'comment'
                                }`}</Text>
                              )}
                              {newReplies && (
                                <Text fontSize="xs">{`${newReplies} new ${
                                  newReplies > 1 ? 'replies' : 'reply'
                                }`}</Text>
                              )}
                            </VStack>
                          </HStack>
                        </LinkBox>
                      </Box>
                    )
                  })
                )}
              </VStack>
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

export async function getServerSideProps(props: { req: NextApiRequest; res: NextApiResponse }) {
  const session = await getSession({ req: props.req })
  const token = (session?.accessToken as string) || ''
  if (!token) return { props: { access: false } }
  if (!process.env.ALLOWED_EMAILS?.includes(session?.user?.email as string))
    return { props: { access: false } }

  const discussionCategories = await makeGenericGraphQlRequest({
    post: true,
    request: CATEGORY_LIST_QUERY,
    token,
  })

  return { props: { access: true, token, discussionCategories } }
}

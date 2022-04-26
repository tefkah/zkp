import { Heading, VStack, HStack, Box, Spinner, Divider } from '@chakra-ui/react'
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import Head from 'next/head'
import { useMemo } from 'react'
import { useCookies } from 'react-cookie'
import { ViewGithub } from '../../components/Buttons/ViewGithub'
import { NewDiscussion } from '../../components/discs/NewDiscussion'
import { BasicLayout } from '../../components/Layouts'
import { useDiscussion } from '../../hooks/useDiscussion'
import { CategoryData, CATEGORY_LIST_QUERY, DiscussionEdge } from '../../queries/getDiscussion'
import makeGenericGraphQlRequest from '../../queries/makeGenericGraphQLRequest'
import { DiscussionCard } from '../../components/discs/DiscussionCard'

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

export const DiscussionsPage = (props: Props) => {
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

  const { lastVisit, commentCount, replyCount, totalCount } = cookies.visit

  const discussionList = useMemo(
    () =>
      // @ts-expect-error
      data?.data?.repository?.discussions?.edges?.map((discussion: DiscussionEdge) => (
        <DiscussionCard
          key={discussion.node.title}
          {...{ lastVisit, commentCount, replyCount, totalCount }}
          node={discussion.node}
        />
      )),
    [data],
  )
  return (
    access && (
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
              {isLoading && !data ? <Spinner /> : discussionList})
            </VStack>
          </VStack>
        </Box>
      </>
    )
  )
}

DiscussionsPage.getLayout = (page: React.ReactElement) => <BasicLayout>{page}</BasicLayout>

DiscussionsPage.auth = true

export const getServerSideProps = async (props: { req: NextApiRequest; res: NextApiResponse }) => {
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
export default DiscussionsPage

import { Box, Text, Container, Heading, Skeleton, VStack, HStack } from '@chakra-ui/react'
import Head from 'next/head'
import React, { ReactElement } from 'react'
import BasicLayout from '../../components/Layouts/BasicLayout'
import Milestone from '../../components/Doing/Milestone'
import IssueList, { NearestMilestoneData } from '../../components/Doing/IssueList'
import ActivityLayout from '../../components/Layouts/ActivityLayout'
import { nearestMilestoneWithIssues } from '../../queries/milestones'
import makeGenericGraphQlRequest from '../../queries/makeGenericGraphQLRequest'
import { getAppAccessToken } from '../../queries/getAccessToken'

interface Props {
  milestoneContent: NearestMilestoneData
}

export default function Doing({ milestoneContent }: Props): ReactElement {
  return (
    <>
      <Head>
        <title>Current Goal | Thomas' Thesis</title>
        <meta
          name="description"
          content={`${milestoneContent?.data?.repository?.milestones?.edges?.[0]?.node?.title}, due on ${milestoneContent?.data?.repository?.milestones?.edges?.[0]?.node?.dueOn}`}
        />
      </Head>
      <IssueList {...{ milestoneContent }} />
    </>
  )
}

Doing.getLayout = (page: React.ReactElement) => <ActivityLayout>{page}</ActivityLayout>

export async function getServerSideProps() {
  const token = await getAppAccessToken('thomasfkjorna/thesis-writing')

  const milestoneContent: NearestMilestoneData = await makeGenericGraphQlRequest({
    request: nearestMilestoneWithIssues({ first: 100 }),
    token,
    post: true,
  })

  return { props: { milestoneContent } }
}

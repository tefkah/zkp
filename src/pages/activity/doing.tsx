import { Box, Text, Container, Heading, Skeleton, VStack, HStack } from '@chakra-ui/react'
import Head from 'next/head'
import React, { ReactElement } from 'react'
import BasicLayout from '../../components/Layouts/BasicLayout'
import Milestone from '../../components/Doing/Milestone'
import IssueList from '../../components/Doing/IssueList'
import ActivityLayout from '../../components/Layouts/ActivityLayout'

interface Props {}

export default function Doing({}: Props): ReactElement {
  return (
    <>
      <Head>
        <title>Activity | Thomas' Thesis</title>
      </Head>
      <IssueList />
    </>
  )
}

Doing.getLayout = (page: React.ReactElement) => <ActivityLayout>{page}</ActivityLayout>

export async function getServerSideProps() {
  return { props: {} }
}

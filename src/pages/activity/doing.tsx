import { Box, Text, Container, Heading, Skeleton, VStack, HStack } from '@chakra-ui/react'
import Head from 'next/head'
import React, { ReactElement } from 'react'
import BasicLayout from '../../components/Layouts/BasicLayout'
import Milestone from '../../components/Doing/Milestone'

interface Props {}

export default function Doing({}: Props): ReactElement {
  return (
    <>
      <Head>
        <title>Activity | Thomas' Thesis</title>
      </Head>
      <Box minH="100vh">
        <VStack my={10}>
          <Milestone />
        </VStack>
      </Box>
    </>
  )
}

Doing.getLayout = (page: React.ReactElement) => <BasicLayout>{page}</BasicLayout>

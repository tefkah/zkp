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
} from '@chakra-ui/react'
import Head from 'next/head'
import Link from 'next/link'
import { join } from 'path'
import React from 'react'
import { FaGithub } from 'react-icons/fa'
import { ViewGithub } from '../../Buttons/ViewGithub'
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
  const { discussions } = props
  return (
    <>
      <Head>
        <title>Discussions | Thomas' Thesis</title>
      </Head>
      <Box minH="100vh" my={10}>
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
            {discussions.map((discussion: Discussions) => {
              const { title, comment, number } = discussion
              return (
                <LinkBox
                  borderWidth={1}
                  key={title}
                  borderRadius="sm"
                  as={Container}
                  py={2}
                  transition="color 0.2s"
                  _hover={{ color: 'red.500' }}
                >
                  <Heading size="md" fontWeight="600">
                    <Link passHref href={`/discussions/${number}`}>
                      <LinkOverlay>{title}</LinkOverlay>
                    </Link>
                  </Heading>
                  <Text>{comment}</Text>
                </LinkBox>
              )
            })}
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

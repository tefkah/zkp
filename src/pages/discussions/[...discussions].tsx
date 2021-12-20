import {
  Link as ChakraLink,
  Text,
  Box,
  Container,
  Flex,
  Heading,
  IconButton,
  Tag,
  useDisclosure,
  VStack,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react'
import { join } from 'path'
import React, { ReactElement } from 'react'
import process from 'process'
import { format, parse } from 'date-fns'
import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'
import BasicLayout from '../../components/Layouts/BasicLayout'
import { Discussions } from '.'
import { ViewGithub } from '../../components/Buttons/ViewGithub'
import Discussion from '../../components/Discussions'
import { Giscus } from '../../components/Discussions/Giscus'
import Widget from '../../components/discs/Widget'
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'

interface Props {
  access: boolean
  token?: string
  title?: string
}

export default function FilePage(props: Props) {
  const { title, access, token } = props

  return (
    <>
      {access && (
        <>
          <Head>
            <title>{`${title} | Thomas Thesis`}</title>
          </Head>
          <VStack minH="100vh" px={{ base: 4, md: 16 }} alignItems="start" spacing={32} my={5}>
            <Box>
              <Container>
                <Heading>{title}</Heading>
                {/* <ViewGithub
              repo="thesis-discussions"
              //slug={`discussions/${number}`}
              text="View discussion on GitHub"
            /> */}
                {/* <Text mt={5}>{comment}</Text>
            {link && (
              <Link href={link} passHref>
                <ChakraLink>Link to Chapter</ChakraLink>
              </Link> */}
              </Container>
            </Box>
            <Widget
              repo={'ThomasFKJorna/thesis-discussions'}
              term={title as string}
              //number={0}
              category={''}
              repoId={'R_kgDOGiFakw'}
              origin={''}
              categoryId={''}
              description={''}
            />
            {/* <Giscus
            repo={'ThomasFKJorna/thesis-discussions'}
            repoId="R_kgDOGiFakw"
            mapping="number"
            term={number}
            theme={useColorModeValue('light', 'dark')}
          /> */}
          </VStack>
        </>
      )}
    </>
  )
}

export interface ServerSideProps {
  req: NextApiRequest
  res: NextApiResponse
  params: { discussions: string[] }
}

export async function getServerSideProps(props: ServerSideProps) {
  const session = await getSession({ req: props.req })
  if (!session) return { props: { access: false } }
  if (!process.env.ALLOWED_EMAILS?.split(',')?.includes(session?.user?.email as string))
    return {
      props: { access: false },
    }
  const title = props.params.discussions
  return { props: { access: true, token: session.accessToken, title } }
}

FilePage.getLayout = function getLayout(page: ReactElement) {
  return <BasicLayout>{page}</BasicLayout>
}

FilePage.auth = true

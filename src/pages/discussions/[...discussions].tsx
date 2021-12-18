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
import { Giscus } from '@giscus/react'
import BasicLayout from '../../components/Layouts/BasicLayout'
import { getSession } from 'next-auth/react'
import { Discussions } from '.'
import { ViewGithub } from '../../Buttons/ViewGithub'

interface Props {
  number: string
  title: string
  comment: string
  link?: string
}

export default function FilePage(props: Props) {
  const { title, number, comment, link } = props

  return (
    <>
      <Head>
        <title>{`Discussions | Thomas Thesis`}</title>
      </Head>
      <VStack minH="100vh" spacing={32} my={5}>
        <Container>
          <Heading>{title}</Heading>
          <ViewGithub
            repo="thesis-discussions"
            slug={`discussions/${number}`}
            text="View discussion on GitHub"
          />
          <Text mt={5}>{comment}</Text>
          {link && (
            <Link href={link} passHref>
              <ChakraLink>Link to Chapter</ChakraLink>
            </Link>
          )}
        </Container>
        <Container>
          <Giscus
            repo={'ThomasFKJorna/thesis-discussions'}
            repoId="R_kgDOGiFakw"
            mapping="number"
            term={number}
            theme={useColorModeValue('light', 'dark')}
          />
        </Container>
      </VStack>
    </>
  )
}

export interface ServerSideProps {
  params: { discussions: string[] }
}

export async function getServerSideProps(props: ServerSideProps) {
  const fs = require('fs')
  const cwd = process.cwd()
  const discussions: Discussions[] = JSON.parse(
    await fs.promises.readFile(join(cwd, 'notes', 'discussions.json'), { encoding: 'utf8' }),
  )
  const number = props.params.discussions.join('')
  const disc = discussions.find((discussion) => discussion.number === parseInt(number))
  const { title, comment, link } = disc!

  return {
    props: {
      number,
      title,
      comment,
      link: link || null,
    },
  }
}

FilePage.getLayout = function getLayout(page: ReactElement) {
  return <BasicLayout>{page}</BasicLayout>
}

FilePage.auth = true

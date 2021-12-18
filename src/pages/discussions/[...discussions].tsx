import {
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

interface Props {
  allowedEmails: string[]
  number: string
  title: string
}

export default function FilePage(props: Props) {
  const { title, number } = props

  return (
    <>
      <Head>
        <title>{`Discussions | Thomas Thesis`}</title>
      </Head>
      <VStack minH="full">
        <Heading>{title}</Heading>
        <Container>
          <Giscus
            repo={'ThomasFKJorna/thesis-discussions'}
            repoId="R_kgDOGiFakw"
            mapping="number"
            term={number}
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
  const title = discussions.find((discussion) => discussion.number === parseInt(number))?.title

  const session = await getSession()

  console.log(session)
  return {
    props: {
      allowedEmails: process.env.ALLOWED_EMAILS?.split(','),
      number,
      title,
    },
  }
}

FilePage.getLayout = function getLayout(page: ReactElement) {
  return <BasicLayout>{page}</BasicLayout>
}

FilePage.auth = true

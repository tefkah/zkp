import { Heading, VStack } from '@chakra-ui/react'
import React, { ReactElement } from 'react'
import process from 'process'
import Head from 'next/head'
import { NextApiRequest, NextApiResponse } from 'next'

import { getSession } from 'next-auth/react'
import { Widget } from '../../components/discs/Widget'
import { BasicLayout } from '../../components/Layouts'

interface Props {
  access: boolean
  token?: string
  title?: string
}

export const FilePage = (props: Props) => {
  const { title, access } = props

  return (
    access && (
      <>
        <Head>
          <title>{`${title} | Thomas Thesis`}</title>
        </Head>
        <VStack minH="100vh" px={{ base: 4, md: 16 }} alignItems="start" spacing={12} my={5}>
          <Heading>{title}</Heading>
          <Widget
            full
            repo="ThomasFKJorna/thesis-discussions"
            term={title as string}
            category=""
            repoId="R_kgDOGiFakw"
            origin=""
            categoryId=""
            description=""
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
    )
  )
}

export interface ServerSideProps {
  req: NextApiRequest
  res: NextApiResponse
  params: { discussions: string[] }
}

export const getServerSideProps = async (props: ServerSideProps) => {
  const session = await getSession({ req: props.req })
  if (!session) return { props: { access: false } }
  if (!process.env.ALLOWED_EMAILS?.split(',')?.includes(session?.user?.email as string))
    return {
      props: { access: false },
    }
  const title = props.params.discussions
  return { props: { access: true, token: session.accessToken, title } }
}

FilePage.getLayout = (page: ReactElement) => <BasicLayout>{page}</BasicLayout>

FilePage.auth = true

export default FilePage

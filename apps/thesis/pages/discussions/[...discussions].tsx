import React, { ReactElement } from 'react'
import process from 'process'
import Head from 'next/head'
import { NextApiRequest, NextApiResponse } from 'next'

import { getSession } from 'next-auth/react'
import { Widget } from '@zkp/discus'
import { BasicLayout } from '../../components/Layouts'

interface Props {
  access: boolean
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
        <div className="my-5 flex min-h-[100vh] flex-col items-start gap-12 px-4 md:px-16">
          {/* // <VStack minH="100vh" px={{ base: 4, md: 16 }} alignItems="start" spacing={12} my={5}> */}
          <h2 className="text-2xl font-bold">{title}</h2>
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
        </div>
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

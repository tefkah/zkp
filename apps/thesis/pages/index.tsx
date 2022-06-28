import Head from 'next/head'
import React, { ReactElement } from 'react'
import { Hero } from '../components/Hero'
import { BasicLayout } from '../components/Layouts'

// TODO: Import the text for the first page from an MDX file
export const Index = () => (
  <>
    <Head>
      <title>A Thesis about Infinity, allegedly</title>
      <meta
        name="description"
        content="An interactive Master's thesis in the philosophy of science."
      />
    </Head>
    <div>
      <Hero title="Thomas' Personal Panopticon" />
    </div>
  </>
)

const getLayout = (page: ReactElement) => <BasicLayout>{page}</BasicLayout>

Index.getLayout = getLayout

export default Index

export const getStaticProps = async () => ({ props: {}, revalidate: 60 })

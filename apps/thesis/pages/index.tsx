import { Text, Container, Heading, VStack, Link } from '@chakra-ui/layout'
import Head from 'next/head'
import React, { ReactElement } from 'react'
import { Hero } from '../components/Hero'
import { BasicLayout } from '../components/Layouts'
import { Main } from '../components/Main'

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
    <div className="bg-slate-200">
      <VStack>
        <Hero title="Thomas' Personal Panopticon" />
        <Main>
          <Container mb={40}>
            <VStack spacing={10} alignItems="flex-start">
              <VStack alignItems="flex-start">
                <Heading>Why?</Heading>
                <p className="text-emerald-500">
                  I need pressure, and I want to explore what open science in the humanities can be.
                </p>
              </VStack>
              <VStack alignItems="flex-start">
                <Heading>Where do I start?</Heading>
                <Text>
                  <Link color="blue.500" href="/history">
                    History
                  </Link>{' '}
                  to see what I have been up to.
                </Text>
                <Text>
                  <Link color="blue.500" href="/Outline-Anyons">
                    The most recent chapter I am working on
                  </Link>
                </Text>
              </VStack>
              <VStack alignItems="flex-start">
                <Heading>Is this... done?</Heading>
                <Text>Hahahahahahahahahahahaha no.</Text>
              </VStack>
            </VStack>
          </Container>
        </Main>
      </VStack>
    </div>
  </>
)

const getLayout = (page: ReactElement) => <BasicLayout>{page}</BasicLayout>

Index.getLayout = getLayout

export default Index

export const getStaticProps = async () => ({ props: {}, revalidate: 60 })

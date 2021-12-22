import { Text, Container, Heading, VStack, Link } from '@chakra-ui/layout'
import Head from 'next/head'
import React, { ReactElement } from 'react'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { Hero } from '../components/Hero'
import BasicLayout from '../components/Layouts/BasicLayout'
import { Main } from '../components/Main'

interface Props {}

export default function Index({}: Props): ReactElement {
  return (
    <>
      <Head>
        <title>A Thesis about Infinity, allegedly</title>
        <meta
          name="description"
          content="An interactive Master's thesis in the philosophy of science."
        />
      </Head>
      <div>
        <VStack>
          <Hero title="Thomas' Personal Panopticon" />
          <Main>
            <Container mb={40}>
              <VStack spacing={10} alignItems="flex-start">
                <VStack alignItems="flex-start">
                  <Heading>Why?</Heading>
                  <Text>
                    I need pressure, and I want to explore what open science in the humanities can
                    be.
                  </Text>
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
                      The most recent chapter I'm working on
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
}

Index.getLayout = function getLayout(page: ReactElement) {
  return <BasicLayout>{page}</BasicLayout>
}

export async function getStaticProps() {
  return { props: {}, revalidate: '60s' }
}

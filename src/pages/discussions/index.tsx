import { Container, VStack } from '@chakra-ui/react'
import Link from 'next/link'
import { join } from 'path'
import React from 'react'
import BasicLayout from '../../components/Layouts/BasicLayout'

export interface Discussions {
  title: string
  number: number
}
interface Props {
  discussions: Discussions[]
}

export default function DiscussionsPage(props: Props) {
  const { discussions } = props
  return (
    <VStack minH="100vh">
      {discussions.map((discussion: Discussions) => {
        const { title, number } = discussion
        return (
          <Container key={title}>
            <Link href={`/discussions/${number}`}>
              <a>{title}</a>
            </Link>
          </Container>
        )
      })}
    </VStack>
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

import { Alert, AlertIcon, Box, Text } from '@chakra-ui/react'
import React from 'react'
import useSWR from 'swr'
import { Widget } from '../Discussions/Widget'
import '../styles/base.css'
interface Props {
  title: string
  repo: string
  category: string
  categoryId?: string
}

export const CommentBox = (props: Props) => {
  const { title } = props
  const { data } = useSWR('/api/auth/goodemail')
  if (data && data.access) {
    return (
      <Box mt={20}>
        <Alert my={10} borderRadius="md" status="info">
          <AlertIcon />
          <Text as="em">
            If you see this, this means you are my supervisor. No one else (except for Thomas) is
            able to see this.
          </Text>
        </Alert>
        <Widget
          repo="ThomasFKJorna/thesis-discussions"
          repoId="R_kgDOGiFakw"
          category="Feedback"
          categoryId="DIC_kwDOGiFak84CASa-"
          term={title}
          origin=""
          description=""
        />
      </Box>
    )
  }
  return (
    <div className="mt-20">
      <Widget
        repo="ThomasFKJorna/thesis-writing"
        repoId="R_kgDOGVpQ7Q"
        category="General"
        category-id="DIC_kwDOGVpQ7c4CAQYS"
        term={title}
        origin=""
        categoryId=""
        description=""
      />
    </div>
  )
}

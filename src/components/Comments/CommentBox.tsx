import { Alert, AlertIcon, Box, Text, useColorModeValue, VStack } from '@chakra-ui/react'
import { Giscus } from '@giscus/react'
import { signOut, useSession } from 'next-auth/react'
import React from 'react'

interface Props {
  allowedEmails: string[]
}

export const CommentBox = (props: Props) => {
  const { data: session } = useSession()
  if (session) {
    return (
      <Box mt={20}>
        <Alert my={10} status="info">
          <AlertIcon />
          <Text as="em">
            If you see this, this means you are my supervisor. No one else is able to see this.
          </Text>
        </Alert>
        <Giscus
          repo="ThomasFKJorna/thesis-discussions"
          repoId="R_kgDOGiFakw"
          category="Feedback"
          categoryId="DIC_kwDOGiFak84CASa-"
          mapping="pathname"
          reactionsEnabled="1"
          emitMetadata="1"
          theme={useColorModeValue('light', 'dark')}
        />
      </Box>
    )
  }
  return (
    <Box mt={20}>
      <Giscus
        repo="ThomasFKJorna/thesis-writing"
        repoId="R_kgDOGVpQ7Q"
        category="General"
        category-id="DIC_kwDOGVpQ7c4CAQYS"
        mapping="pathname"
        // term="..."
        reactionsEnabled="1"
        emitMetadata="1"
        theme={useColorModeValue('light', 'dark')}
      />
    </Box>
  )
}

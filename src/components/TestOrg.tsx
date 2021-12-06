import { Box, Container, Flex, Heading, Spinner, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { OrgProcessor } from './OrgProcessor'
import useFetch from '../utils/useFetch'

interface Props {
  commit1: string
  commit2: string
}

export const TestOrg = (props: Props) => {
  const { commit1, commit2 } = props
  //const [orgText, setOrgText] = useState<any[]>([])
  const { data: text, isLoading, isError } = useFetch(`api/compare/${commit1}/${commit2}`)

  if (isLoading) {
    return <Spinner />
  }
  //  useEffect(() => {
  //    if (!isLoading) {
  const texts = text.map((t: any) => {
    const res = OrgProcessor({ text: t.diff })
    return (
      <Container
        key={t.file}
        w="45%"
        my={10}
        p={4}
        boxShadow="2xl"
        borderRadius="xl"
        borderStyle="solid"
      >
        <Flex justifyContent="space-between" alignItems="center">
          <Text> File </Text>
          <Heading
            color="gray.500"
            fontSize={12}
            maxW="80%"
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
          >
            {t.file}
          </Heading>
        </Flex>
        <Box maxWidth="100%">{res}</Box>
      </Container>
    )
  })

  //      setOrgText(texts)
  //    }
  //    setOrgText([])
  //  }, [text])

  // const t = orgText ? orgText : <Spinner />
  console.log(texts)
  return <Flex flexWrap="wrap">{texts}</Flex>
}

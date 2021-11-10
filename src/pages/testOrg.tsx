import { Box, Container, Flex, Heading, Spinner, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { OrgProcessor } from '../components/OrgProcessor'
import useFetch from '../utils/useFetch'

interface Props {
  commit1: string
  commit2: string
}

export const TestOrg = (props: Props) => {
  const { commit1, commit2 } = props
  const [orgText, setOrgText] = useState<any[]>([])
  const { data: text, isLoading, isError } = useFetch(`api/compare/${commit1}/${commit2}`)

  useEffect(() => {
    if (!isLoading) {
      text.forEach((t: any) =>
        OrgProcessor({ text: t.diff }).then((res) => {
          const a = (
            <Container w="45%" my={10} p={4} boxShadow="2xl" borderRadius="xl" borderStyle="solid">
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
              <Box width="100%">{res}</Box>
            </Container>
          )
          setOrgText((curr: any[]) => [...curr, a])
        }),
      )
    }
    setOrgText([])
  }, [text])
  const t = orgText ? orgText : <Spinner />
  //console.log(t)
  return <Flex flexWrap="wrap">{t}</Flex>
}

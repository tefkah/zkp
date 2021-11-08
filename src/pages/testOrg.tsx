import { Box, Container, Heading, Spinner, Text } from '@chakra-ui/react'
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
            <Container my={10}>
              <Text>--------------------------------</Text>
              <Heading fontSize={20}>{t.filepath}</Heading>
              <Box>{res}</Box>
            </Container>
          )
          setOrgText((curr: any[]) => [...curr, res])
        }),
      )
    }
    setOrgText([])
  }, [text])
  const t = orgText ? orgText : <Spinner />
  //console.log(t)
  return <div>{t}</div>
}

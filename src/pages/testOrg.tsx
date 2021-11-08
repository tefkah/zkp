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
  // console.log(isLoading ? text : text[1].diff)
  useEffect(() => {
    if (!isLoading) {
      text.forEach((t: any) =>
        OrgProcessor({ text: t.diff }).then((res) => {
          const a = (
            <Container>
              <Heading>{t.title}</Heading>
              <Box>{res}</Box>
            </Container>
          )
          setOrgText((curr: any[]) => [...curr, res])
        }),
      )
    }
    setOrgText([<Spinner />])
  }, [text])
  const t = orgText ? <Spinner /> : orgText
  //console.log(t)
  return <div>{orgText}</div>
}

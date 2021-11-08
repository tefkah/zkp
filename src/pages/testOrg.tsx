import { Box, Container, Heading, Spinner, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { OrgProcessor } from '../components/OrgProcessor'
import useFetch from '../utils/useFetch'

interface Props {}

function testOrg(props: Props) {
  const [orgText, setOrgText] = useState<any[]>([])
  const [commit1, commit2] = [
    'dac9e2cf1d2d9964e7ddb375b692c71326776b64',
    '23d36ae61a2ba87ad0ecd76dc90ad9ecfaa8a95f',
  ]
  const { data: text, isLoading, isError } = useFetch(`api/compare/${commit1}/${commit2}`)
  // console.log(isLoading ? text : text[1].diff)
  useEffect(() => {
    if (!isLoading) {
      console.log(text[1].diff)
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

export default testOrg

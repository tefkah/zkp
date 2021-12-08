import { Box } from '@chakra-ui/react'
import React, { ReactNode } from 'react'
import { parseOrg } from '../server/parseOrg'
import { noteStyle } from './NoteStyle'

interface Props {
  text: string
}

export const OrgProcessor = (props: Props) => {
  // try {
  const processedText = parseOrg(props)

  const t = (
    <Box
      className="org-box"
      sx={{
        ...noteStyle,
      }}
    >
      {(processedText as ReactNode) || null}
    </Box>
  )
  //console.log(t)
  // return await processedText
  return t
  //  } catch (e) {
  //    console.log(e)
  //  }
}

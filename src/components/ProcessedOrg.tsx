import { Box } from '@chakra-ui/react'
import React, { ReactNode } from 'react'
import { Data, ParsedOrg } from '../server/parseOrg'
import { FilesData } from '../utils/IDIndex/getFilesData'
import { noteStyle } from './NoteStyle'

interface Props {
  text: string
  data?: Data
}

export const ProcessedOrg = (props: Props) => {
  // try {
  const { text, data } = props

  return (
    <Box
      className="org-box"
      sx={{
        ...noteStyle,
      }}
    >
      <ParsedOrg {...{ text, data }} />
    </Box>
  )
}

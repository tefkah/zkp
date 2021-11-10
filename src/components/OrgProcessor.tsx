import { Box } from '@chakra-ui/react'
import React, { ReactNode } from 'react'
import { parseOrg } from '../server/parseOrg'
import { NoteStyle } from './NoteStyle'

interface Props {
  text: string
}

export const OrgProcessor = async (props: Props) => {
  // try {
  const processedText = await parseOrg(props)

  const t = (
    <Box
      my={10}
      className="org-box"
      sx={{
        ...NoteStyle,
        'span ~ p': {
          display: 'inline',
        },
        title: {
          fontSize: 32,
        },
        '.block-addition': {
          //p: 3,
          color: 'green.500',
          backgroundColor: 'green.50',
          // display: 'inline-block !important',
        },
        '.block-deletion': {
          // p: 3,
          color: 'red.500',
          backgroundColor: 'red.50',
          fontStyle: 'italic',
          textDecoration: 'line-through',
          // display: 'inline-block !important',
        },
        '.span-addition': {
          //p: 3,
          color: 'green.500',
          backgroundColor: 'green.50',
          display: 'inline-block !important',
        },
        '.span-deletion': {
          // p: 3,
          color: 'red.500',
          backgroundColor: 'red.50',
          fontStyle: 'italic',
          textDecoration: 'line-through',
          display: 'inline-block !important',
        },
      }}
    >
      {(processedText.result as ReactNode) || null}
    </Box>
  )
  //console.log(t)
  // return await processedText
  return t
  //  } catch (e) {
  //    console.log(e)
  //  }
}

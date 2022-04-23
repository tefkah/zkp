import { Box, Heading, Text, Spinner } from '@chakra-ui/react'
import React from 'react'
import useSWR from 'swr'
import { ParsedOrg } from '../../services/thesis/parseOrg'
import { noteStyle } from '../NoteStyle'

interface PopoverPreviewProps {
  // eslint-disable-next-line react/no-unused-prop-types
  href: string
  title: string
  id: string | undefined
}

export const PopoverPreview = (props: PopoverPreviewProps) => {
  const { id, title } = props

  const { data, error } = useSWR(`/api/file/byId/${id}`)
  return (
    <Box w="100%" px={3} sx={noteStyle}>
      <Heading size="md">{title}</Heading>
      {
        // eslint-disable-next-line no-nested-ternary
        !data ? (
          <Spinner />
        ) : error ? (
          <Text>Something went wrong, contact Thomas on Github</Text>
        ) : (
          <ParsedOrg type="popover" currentId={id!} text={data.file} />
        )
      }
    </Box>
  )
}

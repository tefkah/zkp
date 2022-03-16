import { Box, Heading, Text, Spinner } from '@chakra-ui/react'
import React from 'react'
import useSWR from 'swr'
import { ParsedOrg } from '../../services/thesis/parseOrg'
import { noteStyle } from '../NoteStyle'

interface PopoverPreviewProps {
  href: string
  title: string
  id: string | undefined
}

export const PopoverPreview = (props: PopoverPreviewProps) => {
  const { id, href, title } = props

  const { data, error } = useSWR(`/api/file/byId/${id}`)
  console.log(data)
  return (
    <Box w="100%" px={3} sx={noteStyle}>
      <Heading size="md" variant="org">
        {title}
      </Heading>
      {!data ? (
        <Spinner />
      ) : error ? (
        <Text>Something went wrong, contact Thomas on Github</Text>
      ) : (
        <ParsedOrg text={data.file} />
      )}
    </Box>
  )
}

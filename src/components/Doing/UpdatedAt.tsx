import { HStack, Text, Tooltip } from '@chakra-ui/react'
import React from 'react'
import { isoToDate, isoToDateDistance } from '../../utils/parseTime'
import { ViewGithub } from '../Buttons/ViewGithub'

interface Props {
  url?: string
  updatedAt: string
}

export const UpdatedAt = (props: Props) => {
  const { url, updatedAt } = props
  return (
    <HStack alignItems="center">
      <Tooltip label={isoToDate(updatedAt)}>
        <Text fontSize="xs" color="gray.500">
          Last updated {isoToDateDistance(updatedAt)}
        </Text>
      </Tooltip>
      {url && <ViewGithub full slug={url} />}
    </HStack>
  )
}

import React from 'react'
import { Icon, Text } from '@chakra-ui/react'
import { GoIssueClosed, GoIssueOpened } from 'react-icons/go'
import { VscIssues } from 'react-icons/vsc'
import { BsCheck2Circle } from 'react-icons/bs'

interface Props {
  closed: boolean
}

export const IssueStatus = (props: Props) => {
  const { closed } = props
  return (
    <Icon
      fontSize="lg"
      my={1}
      as={!closed ? VscIssues : BsCheck2Circle}
      fontWeight="bold"
      color={closed ? 'purple.500' : 'green.500'}
    />
  )
}

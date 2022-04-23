import React from 'react'
import { Icon } from '@chakra-ui/react'
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

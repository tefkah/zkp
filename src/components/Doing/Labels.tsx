import { HStack, Tag, Tooltip, useColorModeValue } from '@chakra-ui/react'
import React from 'react'
import { LabelNode, Labels } from './IssueList'

export const IssueLabels = (props: Labels) => {
  const color = useColorModeValue('white', 'black')

  return (
    <HStack spacing="2">
      {props.nodes.map((label: LabelNode) => (
        <Tooltip label={label.description}>
          <Tag
            size="sm"
            color={color}
            borderRadius="xl"
            fontWeight="bold"
            bgColor={`#${label.color}`}
          >
            {label.name}
          </Tag>
        </Tooltip>
      ))}
    </HStack>
  )
}

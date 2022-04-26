import { HStack, Tag, Tooltip } from '@chakra-ui/react'
import { LabelNode, Labels } from '../../types'

export const IssueLabels = (props: Labels) => {
  const color = 'foreground'
  const { nodes } = props

  return (
    <HStack spacing="2">
      {nodes.map((label: LabelNode) => (
        <Tooltip key={label.name} label={label.description}>
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

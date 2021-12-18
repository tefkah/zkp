import { Container, Text, useColorModeValue } from '@chakra-ui/react'
import { Point, PointTooltipProps } from '@nivo/line'
import { format } from 'date-fns'
import React from 'react'
import { CommitChartData, CommitDatum } from '../../api'

export interface TooltipProps {
  point: Point
  commitChartData: CommitChartData
}
export const Tooltip = (props: TooltipProps) => {
  const { point, commitChartData } = props
  const node = point.data as unknown as CommitDatum
  return (
    <Container p={3} borderRadius="md" boxShadow="md" bg={useColorModeValue('gray.50', 'gray.600')}>
      <Text fontWeight="bold">
        {node.message.slice(0, 8) === 'Scripted' ? 'Auto-commit' : node.message}
      </Text>
      <Text color="gray.400" fontSize={9}>{`${format(node.x as Date, 'MMMM dd, hh:mm')}`}</Text>
      {point.serieId === 'Additions' ? (
        <>
          <Text fontSize={12} color="green.500">{`+ ${node.y}`}</Text>
          <Text fontSize={12} color="red.500">
            {`- ${Math.abs(commitChartData[1]?.data?.[point?.index]?.y)}`}
          </Text>
        </>
      ) : (
        <>
          <Text fontSize={12} color="green.500">{`+ ${
            commitChartData[0].data[point.index - commitChartData[0]?.data?.length]?.y
          }`}</Text>
          <Text fontSize={12} color="red.500">{`- ${Math.abs(node.y)}`}</Text>
        </>
      )}
    </Container>
  )
}

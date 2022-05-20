import React from 'react'
import { Button, Center, Text, Heading, HStack, VStack } from '@chakra-ui/react'
import { FaCreativeCommons, FaCreativeCommonsBy, FaCreativeCommonsSa } from 'react-icons/fa'
import { AiFillFilePdf } from 'react-icons/ai'

export interface ItemPanelProps {
  title: string
  pdfLocation: string
}
export const ItemPanel = (props: ItemPanelProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { title, pdfLocation } = props

  return (
    <VStack alignItems="flex-start" spacing={6}>
      <Center w="full">
        <Button size="sm" colorScheme="red" leftIcon={<AiFillFilePdf />}>
          Download PDF
        </Button>
      </Center>
      <VStack alignItems="flex-start">
        <Heading size="xs">Cite as</Heading>
        <Text>Jorna, T. F. K. (unpublished)</Text>
      </VStack>
      <VStack alignItems="flex-start">
        <HStack alignItems="center">
          <Heading size="xs">License</Heading>
          <HStack spacing={1}>
            <FaCreativeCommons />
            <FaCreativeCommonsBy />
            <FaCreativeCommonsSa />
          </HStack>
        </HStack>
        <Text>
          This text is licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
          license.
        </Text>
      </VStack>
    </VStack>
  )
}

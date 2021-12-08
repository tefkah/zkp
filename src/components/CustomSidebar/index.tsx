import {
  Text,
  Flex,
  VStack,
  CloseButton,
  HStack,
  Heading,
  useColorModeValue,
} from '@chakra-ui/react'
import { Collapse } from './Collapse'
import React from 'react'
import { Resizable } from 're-resizable'
import Link from 'next/link'

interface Props {
  items: string[]
  isOpen: boolean
  onClose: any
}

const CustomSideBar = (props: Props) => {
  const { items, isOpen, onClose } = props
  const bg = useColorModeValue('gray.50', 'gray.700')
  return (
    <Collapse
      animateOpacity={false}
      dimension="width"
      in={isOpen}
      //style={{ position: 'relative' }}
      unmountOnExit
    >
      <VStack
        px="3%"
        display="flex"
        backgroundColor={bg}
        pt={10}
        alignItems="flex-start"
        maxW="30vw"
        overflowX="auto"
      >
        <HStack mb={4} justifyContent="space-between" w="full">
          <Heading size="md"> Notes</Heading>
          <CloseButton onClick={onClose} variant="ghost" />
        </HStack>
        <VStack display="flex" maxW="30vw " alignItems="flex-start" spacing={4}>
          {items.map((item) => (
            <Text fontWeight="400" size="sm" isTruncated textTransform="capitalize">
              <Link href={`/${item}`} key={item}>
                {item.replace(/\d{14}-(.*)\.org/g, '$1').replace(/_/g, ' ')}
              </Link>
            </Text>
          ))}
        </VStack>
      </VStack>
    </Collapse>
  )
}
export default CustomSideBar

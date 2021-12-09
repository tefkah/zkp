import {
  Text,
  Flex,
  VStack,
  CloseButton,
  HStack,
  Heading,
  useColorModeValue,
  Box,
  Container,
  Icon,
  useDisclosure,
  IconButton,
} from '@chakra-ui/react'
import { Collapse } from './Collapse'
import React from 'react'
import { Resizable } from 're-resizable'
import Link from 'next/link'
import { File, Files } from '../../pages/[...file]'
import { slugify } from '../../utils/slug'
import { BsFileEarmarkText } from 'react-icons/bs'
import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons'

interface Props {
  items: Files
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
        pt={6}
        alignItems="flex-start"
        w="30vw"
        overflowX="auto"
        overflowY="scroll"
        h="100vh"
      >
        <HStack px="8%" mb={4} justifyContent="space-between" w="full">
          <CloseButton onClick={onClose} variant="ghost" />
        </HStack>
        {Object.entries(items.folders).map(([folder, files]) => (
          <SubMenu {...{ folder, files }} />
        ))}
        <SubMenu folder="Notes" files={items.files} />
      </VStack>
    </Collapse>
  )
}

export interface SubMenuProps {
  folder: string
  files: File[]
}
export const SubMenu = (props: SubMenuProps) => {
  const { folder, files } = props

  const { onToggle, isOpen } = useDisclosure()
  return (
    <Box>
      <Container ml={4} my={4}>
        <HStack>
          <Heading size="sm">{folder}</Heading>
          <IconButton
            variant="ghost"
            aria-label="Close section"
            icon={isOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
            onClick={onToggle}
          />
        </HStack>
      </Container>
      {isOpen && (
        <VStack px="5%" display="flex" w="full" alignItems="flex-start" spacing={4}>
          {files.map((item: File) => (
            <Container>
              <HStack alignItems="baseline">
                <Icon as={BsFileEarmarkText} color="gray.600" size="sm" />
                <Text fontWeight="400" fontSize={14} textTransform="capitalize">
                  <Link href={`/${slugify(item.path)}`} key={item.path}>
                    {item.path
                      .replace(/\d{14}-/g, '')
                      .replace(/\.org/g, '')
                      .replace(/_/g, ' ')}
                  </Link>
                </Text>
              </HStack>
            </Container>
          ))}
        </VStack>
      )}
    </Box>
  )
}
export default CustomSideBar

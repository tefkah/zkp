import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons'
import {
  Text,
  Box,
  Container,
  Flex,
  HStack,
  Link,
  useDisclosure,
  IconButton,
  Heading,
  useColorModeValue,
} from '@chakra-ui/react'
import React from 'react'
import { noteStyle } from '../NoteStyle'

interface Props {
  oid: string
  additions: number
  deletions: number
  filepath: string
  children: React.ReactFragment
}

export const DiffBox = (props: Props) => {
  const { oid, additions, deletions, filepath, children } = props
  const { onToggle, isOpen } = useDisclosure()
  const headerColor = useColorModeValue('gray.50', 'gray.700')
  const bodyColor = useColorModeValue('white', 'gray.800')
  return (
    <Box
      w="full"
      borderWidth={1}
      backgroundColor={bodyColor}
      overflow="auto"
      borderRadius="xl"
      boxShadow="sm"
    >
      <Flex
        w="full"
        //borderTopRadius="md"
        px={4}
        //borderWidth={1}
        py={2}
        alignItems="bottom"
        justifyContent="space-between"
        backgroundColor={headerColor}
        //mb={4}
      >
        <HStack maxW="85%">
          <IconButton
            size="sm"
            variant="ghost"
            icon={isOpen ? <ChevronRightIcon /> : <ChevronDownIcon />}
            aria-label="Hide/Show diff"
            onClick={onToggle}
          />
          <Heading fontWeight="600" isTruncated size="sm">
            {<Link href={`/file/${filepath}`}>{filepath}</Link>}
          </Heading>
        </HStack>
        <HStack>
          <Text mx={3} color="red.500">{`-${deletions}`}</Text>
          <Text color="green.500">{`+${additions}`}</Text>
        </HStack>
      </Flex>
      {!isOpen && (
        <Container my={4} sx={{ ...noteStyle }}>
          {children}
        </Container>
      )}
    </Box>
  )
}

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
  ButtonGroup,
  Button,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { noteStyle } from '../NoteStyle'

interface Props {
  //  oid: string
  additions: number
  deletions: number
  filepath: string
  children: React.ReactFragment
}

export const DiffBox = (props: Props) => {
  const { additions, deletions, filepath, children } = props
  const { onToggle, isOpen } = useDisclosure()
  const [raw, setRaw] = useState(false)
  const headerColor = 'back'
  const bodyColor = 'foreground'
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
        px={4}
        py={2}
        alignItems="bottom"
        justifyContent="space-between"
        backgroundColor={headerColor}
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
            <Link href={`/${filepath}`}>{filepath}</Link>
          </Heading>
        </HStack>
        <HStack spacing={4}>
          <ButtonGroup
            isAttached
            size="sm"
            variant="outline"
            colorScheme={useColorModeValue('gray', 'black')}
          >
            <Button onClick={() => setRaw(false)} isActive={!raw}>
              Rich
            </Button>
            <Button onClick={() => setRaw(true)} isActive={raw}>
              Raw
            </Button>
          </ButtonGroup>
          <HStack>
            <Text mx={3} color="primary">{`-${deletions}`}</Text>
            <Text color="green.500">{`+${additions}`}</Text>
          </HStack>
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

import * as React from 'react'
import { useScrollSpy } from '../hooks/useScrollSpy'
import {
  Box,
  ListItem,
  OrderedList,
  chakra,
  Text,
  useColorModeValue,
  BoxProps,
  HStack,
  Icon,
} from '@chakra-ui/react'
import { Heading } from '../pages/[...file]'
import { VscCircleOutline } from 'react-icons/vsc'
import { FaRegDotCircle } from 'react-icons/fa'

interface TableOfContentProps extends BoxProps {
  headings: Heading[]
}

function TableOfContent(props: TableOfContentProps) {
  const { headings, ...rest } = props
  const activeId = useScrollSpy(
    headings.map(({ id }) => `[id="${id}"]`),
    {
      rootMargin: '0% 0% -24% 0%',
    },
  )
  const linkColor = useColorModeValue('gray.600', 'gray.400')
  const linkHoverColor = useColorModeValue('gray.900', 'gray.600')
  return (
    <Box
      as="nav"
      aria-labelledby="toc-title"
      width="16rem"
      flexShrink={0}
      display={{ base: 'none', xl: 'block' }}
      position="sticky"
      py="10"
      pr="4"
      top="3rem"
      right="0"
      fontSize="sm"
      alignSelf="start"
      maxHeight="calc(100vh - 3rem)"
      overflowY="auto"
      sx={{ overscrollBehavior: 'contain' }}
      {...rest}
    >
      <Text
        as="h2"
        id="toc-title"
        textTransform="uppercase"
        fontWeight="bold"
        fontSize="xs"
        color={useColorModeValue('gray.700', 'gray.400')}
        letterSpacing="wide"
      >
        Table of Contents
      </Text>
      <OrderedList spacing={1} ml="0" mt="4" styleType="none">
        {headings.map(({ id, text, level }) => (
          <ListItem key={id} title={text} ml={level === 'h3' ? '4' : undefined}>
            <HStack spacing="2px" alignItems="center">
              {id === activeId && <Icon as={FaRegDotCircle} h={2} ml={-4} />}
              <chakra.a
                py="1"
                display="block"
                fontWeight={id === activeId ? 'bold' : 'medium'}
                href={`#${id}`}
                aria-current={id === activeId ? 'location' : undefined}
                color={linkColor}
                _hover={{
                  color: linkHoverColor,
                }}
              >
                {text}
              </chakra.a>
            </HStack>
          </ListItem>
        ))}
      </OrderedList>
    </Box>
  )
}

export default TableOfContent

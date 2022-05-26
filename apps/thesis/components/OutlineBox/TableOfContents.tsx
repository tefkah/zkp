import { useMemo } from 'react'
import {
  Box,
  ListItem,
  OrderedList,
  chakra,
  useColorModeValue,
  BoxProps,
  HStack,
} from '@chakra-ui/react'
import { NoteHeading } from '@zkp/types'
import { useScrollSpy } from '../../hooks/useScrollSpy'

interface TableOfContentProps extends BoxProps {
  headings: NoteHeading[]
}

export const TableOfContent = (props: TableOfContentProps) => {
  const { headings } = props
  const activeId = useScrollSpy(
    headings.map(({ id }) => `[id="${id}"]`),
    {
      rootMargin: '0% 0% -24% 0%',
    },
  )
  const linkColor = useColorModeValue('gray.600', 'gray.400')
  const linkHoverColor = useColorModeValue('gray.900', 'gray.600')
  const TOC = useMemo(() => {
    const ml = (level: string | undefined) => {
      const mlh = level === 'h3' ? '4' : 0
      return level === 'h4' ? '8' : mlh
    }

    return (
      <OrderedList spacing={1} ml="0" styleType="none">
        {headings.map(({ id, text, level }) => (
          <ListItem key={`${id}${text}`} title={text} ml={ml(level)}>
            <HStack justifyContent="flex-start" spacing="2px" alignItems="baseline">
              {id === activeId && (
                <Box backgroundColor="primary" h={3} mb={-2} w="2px" mr={1} ml={-2} />
              )}
              <chakra.a
                textAlign="left"
                py="2px"
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
    )
  }, [activeId, headings, linkColor, linkHoverColor])
  return TOC
}

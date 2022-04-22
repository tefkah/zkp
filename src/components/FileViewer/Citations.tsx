import React, { ReactNode, useMemo } from 'react'
//@ts-expect-error
import Citation from 'citation-js'
import { CSLCitation } from '../../lib/api'
import { unified } from 'unified'
import rehype2react, { Options } from 'rehype-react'
import rehypeParse from 'rehype-parse'
import {
  Box,
  ListItem,
  Text,
  OrderedList,
  UnorderedList,
  Link,
  Heading,
  VStack,
} from '@chakra-ui/react'
import { noteStyle } from '../NoteStyle'
import { ExternalLinkIcon } from '@chakra-ui/icons'

interface CitationProps {
  csl: CSLCitation[]
}

export const Citations = (props: CitationProps) => {
  const { csl } = props

  const bibliography = useMemo(() => {
    const cite = new Citation(csl)
    return cite.format('bibliography', { format: 'html', style: 'apa' })
  }, [csl])

  const citations = useMemo(() => {
    const htmlWithLinks = bibliography.replace(/(https?:\/\/([^\<]*))/g, '<a href="$1">$1</a>')

    const processor = unified()
      .use(rehypeParse)
      .use(rehype2react, {
        createElement: React.createElement,
        Fragment: React.Fragment,
        components: {
          html: ({ children }) => children as React.ReactElement,
          body: ({ children }) => children as React.ReactElement,
          head: () => <></>,
          a: ({ href, children }) => (
            <Link color="primary" style={{ alignItems: 'center' }} href={href as string} isExternal>
              {children as string}
              <ExternalLinkIcon mb="2px" ml="2px" />
            </Link>
          ),
          p: Text,
          div: ({ className, children, ...props }) => {
            if ((className as string)?.includes('csl-bib-body')) return <>{children as ReactNode}</>
            if (!(className as string)?.includes('csl-entry')) {
              return (
                <Box {...{ className: className as string, ...props }}>
                  {children as React.ReactNode}
                </Box>
              )
            }
            return (
              //@ts-ignore
              <Text variant="org" {...props}>
                {children as React.ReactNode}
              </Text>
            )
          },
          li: ListItem,
          ol: OrderedList,
          ul: UnorderedList,
          h: Heading,
          i: ({ children, ...props }) => (
            //@ts-ignore
            <Text as="i" variant="org" {...props}>
              {children as React.ReactNode}
            </Text>
          ),
        },
      } as Options)

    return <>{processor.processSync(htmlWithLinks).result as React.ReactNode}</>
  }, [bibliography])

  return (
    <>
      <Heading id="references" style={{ scrollMarginTop: '100px' }} size="md">
        References
      </Heading>
      <VStack sx={{ ...noteStyle }} alignItems="flex-start">
        {citations}
      </VStack>
    </>
  )
}

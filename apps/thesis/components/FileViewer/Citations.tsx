/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react/no-unstable-nested-components */
import React, { ReactNode, useMemo } from 'react'

// @ts-expect-error citation???
import Citation from 'citation-js'
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
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { noteStyle } from '../NoteStyle'
import { CSLCitation } from '../../types'

interface CitationProps {
  csl: CSLCitation[]
}

/**
 * TODO: Move citations component to separate lib, no longer needed for this project but a waste to just throw away
 */
export const Citations = (props: CitationProps) => {
  const { csl } = props

  const bibliography = useMemo(() => {
    const cite = new Citation(csl)
    return cite.format('bibliography', { format: 'html', style: 'apa' })
  }, [csl])

  const citations = useMemo(() => {
    const htmlWithLinks = bibliography.replace(/(https?:\/\/([^<]*))/g, '<a href="$1">$1</a>')

    const processor = unified()
      .use(rehypeParse)
      .use(rehype2react, {
        createElement: React.createElement,
        Fragment: React.Fragment,
        components: {
          html: ({ children }) => children as React.ReactElement,
          body: ({ children }) => children as React.ReactElement,
          head: () => null,
          a: ({ href, children }) => (
            <Link color="primary" style={{ alignItems: 'center' }} href={href as string} isExternal>
              {children as string}
              <ExternalLinkIcon mb="2px" ml="2px" />
            </Link>
          ),
          p: Text,
          div: ({ className, children, ...props }) => {
            if ((className as string)?.includes('csl-bib-body')) return children as ReactNode
            if (!(className as string)?.includes('csl-entry')) {
              return (
                <Box {...{ className: className as string, ...props }}>
                  {children as React.ReactNode}
                </Box>
              )
            }
            return (
              <Text variant="org" {...props}>
                {children as React.ReactNode}
              </Text>
            )
          },
          li: ListItem,
          ol: OrderedList,
          ul: UnorderedList,
          h: Heading,
          em: ({ children, ...props }) => (
            // @ts-expect-error idk man, something about em not being assignable to p
            <Text as="em" variant="org" {...props}>
              {children as React.ReactNode}
            </Text>
          ),
        },
      } as Options)

    return processor.processSync(htmlWithLinks).result as React.ReactNode
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

import React, { ReactNode } from 'react'
import visit from 'unist-util-visit'
//@ts-expect-error
import Citation from 'citation-js'
import { CSLCitation } from '../../api'
import unified from 'unified'
import rehype2react from 'rehype-react'
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

const HTMLtoReact = (html: string) => {
  const htmlWithLinks = html.replace(/(https?:\/\/([^\<]*))/g, '<a href="$1">$1</a>')
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
          if ((className as string).includes('csl-bib-body')) return <>{children as ReactNode}</>
          if (!(className as string).includes('csl-entry')) {
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
        i: ({ children, ...props }) => (
          <Text as="i" variant="org" {...props}>
            {children as React.ReactNode}
          </Text>
        ),
      },
    })

  return <>{processor.processSync(htmlWithLinks).result as React.ReactNode}</>
}

const generateBibliography = (props: CitationProps) => {
  const { csl } = props

  const bibliography = new Citation(csl)
  const bibHTML = bibliography.format('bibliography', { format: 'html', style: 'apa' })
  return HTMLtoReact(bibHTML)
}

export const Citations = (props: CitationProps) => {
  return (
    <>
      <Heading id="references" style={{ scrollMarginTop: '100px' }} size="md">
        References
      </Heading>
      <VStack sx={{ ...noteStyle }} alignItems="flex-start">
        {generateBibliography(props)}
      </VStack>
    </>
  )
}

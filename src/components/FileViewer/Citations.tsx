import React from 'react'
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

interface CitationProps {
  citations: string[]
  csl: CSLCitation[]
}

const HTMLtoReact = (html: string) => {
  const processor = unified()
    .use(rehypeParse)
    .use(rehype2react, {
      createElement: React.createElement,
      Fragment: React.Fragment,
      components: {
        a: Link,
        p: Text,
        div: Box,
        li: ListItem,
        ol: OrderedList,
        ul: UnorderedList,
        h: Heading,
      },
    })

  return <>{processor.processSync(html).result as React.ReactNode}</>
}

const generateBibliography = (props: CitationProps) => {
  const { citations, csl } = props

  const filteredCsl = csl.filter((entry) => citations.includes(entry.id))

  const bibliography = new Citation(filteredCsl)
  const bibHTML = bibliography.format('bibliography', { format: 'html', style: 'apa' })
  return HTMLtoReact(bibHTML)
}

export const Citations = (props: CitationProps) => {
  return <VStack alignItems="flex-start">{generateBibliography(props)}</VStack>
}

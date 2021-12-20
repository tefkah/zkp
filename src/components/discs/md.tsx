import React, { ReactNode } from 'react'
import visit from 'unist-util-visit'
//@ts-expect-error
import Citation from 'citation-js'
import { CSLCitation } from '../../lib/api'
import unified from 'unified'
import remarkParse from 'remark-parse'
import rehype2react from 'rehype-react'
import rehypeParse from 'rehype-parse'
import remarkRehype from 'remark-rehype'
import remarkGFM from 'remark-gfm'
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
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.css'

export const markdownToReact = (markdown: string) => {
  const htmlWithLinks = markdown.replace(/(https?:\/\/([^\<]*))/g, '<a href="$1">$1</a>')
  const processor = unified()
    .use(remarkParse)
    .use(remarkMath)
    .use(remarkGFM)
    .use(remarkRehype)
    .use(rehypeKatex)
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
        div: Box,
        li: ListItem,
        ol: OrderedList,
        ul: UnorderedList,
        h1: Heading,
        h2: Heading,
        h3: Heading,
        h4: Heading,
        i: ({ children, ...props }) => (
          <Text as="i" variant="org" {...props}>
            {children as React.ReactNode}
          </Text>
        ),
      },
    })

  return <>{processor.processSync(htmlWithLinks).result as React.ReactNode}</>
}

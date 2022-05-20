import React from 'react'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import rehype2react, { Options } from 'rehype-react'
import remarkRehype from 'remark-rehype'
import remarkGFM from 'remark-gfm'
import { Box, ListItem, Text, OrderedList, UnorderedList, Link, Heading } from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.css'

// TODO: Create a reusable library for the MDX compiler for this as well, stop reinventing friggin markdown rendering all the time
export const markdownToReact = (markdown: string) => {
  const htmlWithLinks = markdown.replace(/(https?:\/\/([^<]*))/g, '<a href="$1">$1</a>')
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
        head: () => null,
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
          // @ts-expect-error yayayay
          <Text as="i" variant="org" {...props}>
            {children as React.ReactNode}
          </Text>
        ),
      },
    } as Options)

  return processor.processSync(htmlWithLinks).result as React.ReactNode
}

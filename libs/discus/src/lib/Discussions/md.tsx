import React from 'react'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import rehype2react, { Options } from 'rehype-react'
import remarkRehype from 'remark-rehype'
import remarkGFM from 'remark-gfm'
// import { Box, ListItem, Text, OrderedList, UnorderedList, Link, Heading } from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
// import 'katex/dist/katex.css'

// TODO: Create a reusable library for the MDX compiler for this as well, stop reinventing friggin markdown rendering all the time
export interface MarkdownToReactProps {
  children: string
}
export const MarkdownToReact = ({ children }: MarkdownToReactProps) => {
  const htmlWithLinks = children.replace(/(https?:\/\/([^<]*))/g, '<a href="$1">$1</a>')

  const processor = unified()
    .use(remarkParse)
    .use(remarkMath)
    .use(remarkGFM)
    .use(remarkRehype)
    .use(rehypeKatex)
    .use(rehype2react, {
      createElement: React.createElement,
      Fragment: React.Fragment,
    })

  return processor.processSync(htmlWithLinks).result
}

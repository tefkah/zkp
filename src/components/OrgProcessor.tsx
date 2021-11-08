import unified from 'unified'
//import createStream from 'unified-stream'
import uniorgParse from 'uniorg-parse'
import uniorg2rehype from 'uniorg-rehype'
import uniorgSlug from 'uniorg-slug'
import extractKeywords from 'uniorg-extract-keywords'
import attachments from 'uniorg-attach'
// rehypeHighlight does not have any types
// add error thing here
// import highlight from 'rehype-highlight'
//import mathjax from 'rehype-mathjax'
//import 'katex/dist/katex.css'
import katex from 'rehype-katex'
import 'katex/dist/katex.css'
import rehype2react from 'rehype-react'
import visit from 'unist-util-visit'

import React, { useMemo } from 'react'
import { Box, Text } from '@chakra-ui/react'
import { NoteStyle } from './NoteStyle'

interface Props {
  text: string
}

export const orgProcessor = async (props: Props) => {
  const { text } = props
  const processor = unified()
    .use(uniorgParse)
    .use(() => (node) => {
      // visit from unist-util-visit
      visit(node, 'special-block', ({ affiliated, blockType, contentsBegin, contentsEnd }) => {
        if (blockType.toLowerCase() === 'addition') {
          // h from hastscript. or manually as { type: 'element', tagName: 'transclusion', properties: { value: keyword.value } }
          Object.assign(blockType, {
            type: 'element',
            tagName: 'addition',
            properties: { style: { display: 'inline' } },
          })
        }
        if (blockType.toLowerCase() === 'deletion') {
          // h from hastscript. or manually as { type: 'element', tagName: 'transclusion', properties: { value: keyword.value } }
          Object.assign(blockType, {
            type: 'element',
            tagName: 'deletion',
            properties: { style: { display: 'inline' } },
          })
        }
      })
    })
    .use(extractKeywords)
    .use(attachments)
    .use(uniorgSlug)
    .use(uniorg2rehype, { useSections: true })
    .use(katex)
    .use(rehype2react, {
      createElement: React.createElement,
      // eslint-disable-next-line react/display-name
      /*       components: {
        a: ({ children, href }) => {
          return (
            <PreviewLink
              nodeByCite={nodeByCite}
              setSidebarHighlightedNode={setSidebarHighlightedNode}
              href={`${href as string}`}
              nodeById={nodeById}
              setPreviewNode={setPreviewNode}
              openContextMenu={openContextMenu}
              outline={outline}
            >
              {children}
            </PreviewLink>
          )
        },
        img: ({ src }) => {
          return <OrgImage src={src as string} file={previewNode?.file} />
        },
        section: ({ children, className }) => (
          <Section {...{ outline, collapse }} className={className as string}>
            {children}
          </Section>
        ),
        p: ({ children }) => {
          return <p lang="en">{children as ReactNode}</p>
        }, */
    })

  console.log(text)
  return await processor.process(text)
}

export const OrgProcessor = async (props: Props) => {
  const processedText = await orgProcessor(props)

  const t = (
    <Box
      sx={{
        ...NoteStyle,
        '.block-addition': {
          color: 'green.500',
          backgroundColor: 'green.50',
          display: 'inline-block !important',
        },
        '.block-deletion': {
          color: 'red.500',
          backgroundColor: 'red.50',
          fontStyle: 'italic',
          textDecoration: 'line-through',
          display: 'inline-block !important',
        },
      }}
    >
      {processedText.result}
    </Box>
  )
  console.log(t)
  // return await processedText
  return t
}

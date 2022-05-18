// @ts-nocheck shhh
import { unified } from 'unified'
// import createStream from 'unified-stream'
import uniorgParse from 'uniorg-parse'
import uniorg2rehype from 'uniorg-rehype'
import uniorgSlug from 'uniorg-slug'
import extractKeywords from 'uniorg-extract-keywords'
import attachments from 'uniorg-attach'
// rehypeHighlight does not have any types
// add error thing here
// import highlight from 'rehype-highlight'
// import mathjax from 'rehype-mathjax'
// import 'katex/dist/katex.css'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.css'
import rehype2react, { Options } from 'rehype-react'
import { visit } from 'unist-util-visit'

import React, { ReactNode, useMemo } from 'react'
import { Box, Heading, ListItem, OrderedList, Tag, Text, UnorderedList } from '@chakra-ui/react'
// import { noteStyle } from '../components/NoteStyle'
import { Keyword, OrgData, OrgNode, Paragraph, SpecialBlock } from 'uniorg'
import Link from 'next/link'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import remarkMath from 'remark-math'
import remarkGFM from 'remark-gfm'
// @ts-expect-error no types :()
import remarkWikiLink from 'remark-wiki-link'
import { slugify } from '../../utils/slug'
import { PreviewLink } from '../../components/FileViewer/Link'
import { findCiteId, findCiteTitle } from '../../utils/findCiteData'
import { FilesData } from '../../utils/IDIndex/getFilesData'

// export interface Data {
//   data: FilesData
//   orgTexts: { [id: string]: string }
// }
interface Props {
  text: string
  // if we have a diff we don't want to process links etc, because that will fuck up
  data?: FilesData
  currentId: string
  type?: 'default' | 'popover'
  backlink?: boolean
}

export const ParsedOrg = (props: Props): React.ReactElement | null => {
  const { text, data, type, currentId } = props
  const processor = useMemo(
    () =>
      unified()
        .use(remarkParse)
        .use(remarkMath)
        .use(remarkWikiLink)
        .use(remarkGFM)
        .use(remarkRehype)
        // .use(uniorgParse)
        // .use(() => (node) => {
        //   // visit from unist-util-visit
        //   visit(node, 'keyword', (keyw) => {
        //     const keyword = keyw as Keyword
        //     if (keyword.key.toLowerCase() === 'title') {
        //       //  console.log(keyword)
        //       //  console.log(typeof keyword.value)
        //       // h from hastscript. or manually as { type: 'element', tagName: 'transclusion', properties: { value: keyword.value } }
        //       Object.assign(keyword, {
        //         type: 'element',
        //         tagName: 'h1',
        //         properties: { className: 'title', value: keyword.value },
        //       })
        //     }
        //   })
        //   visit(node, 'special-block', (block) => {
        //     const { affiliated, children, blockType, contentsBegin, contentsEnd } =
        //       block as SpecialBlock
        //     if (blockType.toLowerCase() === 'addition' || blockType.toLowerCase() === 'deletion') {
        //       if (children?.[0].type === 'paragraph' && children.length === 1) {
        //         // console.log('ppppp')
        //         Object.assign(block, {
        //           ...children?.[0],
        //           type: 'element',
        //           tagName: 'span',
        //           properties: {
        //             className: `span-${blockType.toLowerCase()}`,
        //           },
        //         })
        //       }
        //     }
        //     // if (blockType.toLowerCase() === 'deletion') {
        //     //   // h from hastscript. or manually as { type: 'element', tagName: 'transclusion', properties: { value: keyword.value } }
        //     //   Object.assign(block, {
        //     //     type: 'element',
        //     //     tagName: 'div',
        //     //     properties: { className: 'deletion' },
        //     //   })
        //     // }
        //   })
        // })
        // .use(extractKeywords)
        // .use(attachments)
        // .use(uniorgSlug)
        // .use(uniorg2rehype, { useSections: true })
        .use(rehypeKatex, {
          trust: (context) => ['\\htmlId', '\\href'].includes(context.command),
          macros: {
            '\\eqref': '\\href{###1}{(\\text{#1})}',
            '\\ref': '\\href{###1}{\\text{#1}}',
            '\\label': '\\htmlId{#1}{}',
            '\\ocircle': '\\circ',
          },
        })
        .use(rehype2react, {
          createElement: React.createElement,
          components: {
            h1: (head) => {
              const { className, children } = head
              if (className === 'title') {
                return null
              }
              if ((children as string)?.[0] === 'Footnotes:') return null
              return (
                <Heading variant="org" size="lg" {...head}>
                  {children as ReactNode}
                </Heading>
              )
              // return <Heading className="title">{value as string}</Heading>
            },
            h2: (props) => <Heading {...props} variant="org" as="h3" size="md" />,
            h3: (props) => <Heading {...props} variant="org" as="h4" size="sm" />,
            h4: (props) => <Heading {...props} variant="org" as="h5" size="xs" />,
            p: ({ children, ...rest }) => (
              <Text lang="en" variant="org" {...{ ...rest }}>
                {children as ReactNode}
              </Text>
            ),
            div: Box,
            a: ({ href, className, children, ...rest }) => {
              if (!data) {
                return (
                  <Link href={href as string}>
                    <a>{children as ReactNode}</a>
                  </Link>
                )
              }

              if (['footnum', 'footref'].includes(className as string)) {
                return (
                  // @ts-ignore
                  <Text {...{ ...rest }} variant="org" as="span" fontWeight="bold" color="primary">
                    <Link href={href as string}>
                      <a>{children as ReactNode}</a>
                    </Link>
                  </Text>
                )
              }

              const id = (href as string).replace(/id:/g, '')
              const correctLink = data?.[id]?.title || ''

              if (!correctLink && (href as string).replace(/\[?.*?(cite:@?).*\]?/g, '$1')) {
                const cleanCite = (href as string)
                  .replace(/.*?cite:@?(.*)/g, '$1')
                  .replace(/ /g, '')
                const prettyNames = cleanCite
                  .split(',')
                  .map(
                    (cite) =>
                      `${cite.replace(/[0-9]\w*/g, '')}, ${cite.replace(/.*?([0-9])/g, '$1')}`,
                  )

                return (
                  <Text as="span" variant="org">
                    (
                    {prettyNames.map((name, index) => {
                      const title = findCiteTitle(cleanCite, data)
                      const id = findCiteId(cleanCite, data)
                      // const text = data.orgTexts[id] ?? ''
                      if (!title || !id) return <Text as="span">{name}</Text>
                      return (
                        <>
                          {index > 0 && <Text as="span">; </Text>}
                          <PreviewLink
                            currentId={currentId}
                            title={title}
                            // orgText={text}
                            href={`/${slugify(title)}`}
                          >
                            {name}
                          </PreviewLink>
                        </>
                      )
                    })}
                    )
                  </Text>
                )
              }

              // const text = data.orgTexts[id] ?? ''
              return (
                <>
                  {correctLink ? (
                    <PreviewLink
                      currentId={currentId}
                      title={correctLink}
                      //    orgText={text}
                      data={data}
                      href={`/${slugify(correctLink)}`}
                      id={id}
                    >
                      {children}
                    </PreviewLink>
                  ) : (
                    // @ts-ignore
                    <Text as="span" variant="org" _hover={{ cursor: 'not-allowed' }}>
                      {children as ReactNode}
                    </Text>
                  )}
                </>
              )
            },
            ul: UnorderedList,
            ol: OrderedList,
            li: ListItem,
            span: ({ className, children, ...rest }) => {
              if (['span-addition', 'span-deletion'].includes(className as string)) {
                return (
                  // @ts-ignore
                  <Text as="span" variant="org" className={className as string}>
                    {children as ReactNode}
                  </Text>
                )
              }
              // if (className === 'tag') {
              //   return <Tag>{children as ReactNode}</Tag>
              // }
              return (
                // @ts-expect-error yeah man
                <Text as="span" {...{ className: className as string, ...rest }}>
                  {children as ReactNode}
                </Text>
              )
            },
            section: ({ className, children }) => {
              const kids = children as React.ReactElement[]
              if (kids?.[0]?.type === 'h15') {
                if (kids?.[0]?.props?.id?.startsWith('end')) {
                  return <>{kids?.slice(1) as ReactNode}</>
                }
                return (
                  <details>
                    <summary>
                      <Tag
                        bg="primary"
                        color="white"
                        fontWeight="bold"
                        _hover={{ cursor: 'pointer' }}
                      >
                        TODO
                      </Tag>
                    </summary>
                    {kids}
                  </details>
                )
              }
              return (
                <Box className={className as string} as="section">
                  {kids}
                </Box>
              )
            },
            img: ({ src }) => <img src={(src as string).replace(/\.\/media\//g, '/media/')} />,
          },
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
        section: ({ children, className }) => (
          <Section {...{ outline, collapse }} className={className as string}>
            {children}
          </Section>
        ),
        p: ({ children }) => {
          return <p lang="en">{children as ReactNode}</p>
        }, */
        } as Options),
    [],
  )

  try {
    return (
      <Box className={type === 'popover' ? 'popover' : undefined}>
        {processor.processSync(text).result as React.ReactElement}
      </Box>
    )
  } catch (e) {
    console.log(e)
    return null
  }
}

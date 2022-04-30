/* eslint-disable react/jsx-props-no-spreading */
import { Box, Text, Heading, UnorderedList, OrderedList, ListItem, Tag } from '@chakra-ui/react'
import { ReactNode } from 'react'
import Link from 'next/link'
// import Image from 'next/image'
import { MDXComponents } from 'mdx/types'
import { PreviewLink } from '../FileViewer/Link'
import { MDXLinkBase } from './MDXLink'
import { WithId } from './WithId'

export const createMdxRehypeReactCompents = (currentId: string): MDXComponents => {
  // const LinkWithId = WithId<'a'>(MDXLinkBase, currentId)
  const components: MDXComponents = {
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
    a: (node) => {
      const { href, className, alias, children, ...rest } = node
      if (href?.includes('http')) {
        return (
          <Link href={href as string} passHref>
            <a>{children as ReactNode}</a>
          </Link>
        )
      }

      if (['footnum', 'footref'].includes(className as string)) {
        return (
          <Text variant="org" as="span" fontWeight="bold" color="primary">
            <Link href={href as string}>
              <a>{children as ReactNode}</a>
            </Link>
          </Text>
        )
      }

      const title = alias
      return (
        <PreviewLink
          currentId={currentId}
          title={title}
          href={`${(href as string).replace(/#\/page\/?/, '')}`}
          id={title}
        >
          {children}
        </PreviewLink>
      )
    },

    ul: UnorderedList,
    ol: OrderedList,
    li: ListItem,

    span: ({ className, children, ...rest }) => {
      if (className?.includes('citation')) {
        //
      }
      if (['span-addition', 'span-deletion'].includes(className as string)) {
        return (
          // @ts-expect-error yeah man
          <Text {...rest} as="span" variant="org" className={className as string}>
            {children as ReactNode}
          </Text>
        )
      }
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
          return kids?.slice(1) as ReactNode
        }
        return (
          <details>
            <summary>
              <Tag bg="primary" color="white" fontWeight="bold" _hover={{ cursor: 'pointer' }}>
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
  } as MDXComponents
  return components
}

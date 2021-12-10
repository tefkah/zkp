/* eslint-disable react/display-name */
import {
  Box,
  Button,
  Heading,
  Link,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Text,
  useColorModeValue,
  useTheme,
} from '@chakra-ui/react'
import React, { ReactElement, useContext, useEffect, useMemo, useState } from 'react'

import unified from 'unified'
//import createStream from 'unified-stream'
import uniorgParse from 'uniorg-parse'
import uniorg2rehype from 'uniorg-rehype'
//import highlight from 'rehype-highlight'
import katex from 'rehype-katex'
import 'katex/dist/katex.css'
import rehype2react from 'rehype-react'

export interface LinkProps {
  title: string
  href: any
  children: any
  data: FilesData
  orgText: string
  //outline: boolean
  // linksByNodeId: LinksByNodeId
  // isWiki?: boolean
  // noUnderline?: boolean
  // attachDir: string
  // macros: { [key: string]: string }
}

export interface NodeLinkProps {
  href: any
  children: any
  data: FilesData
  //openContextMenu: any
  // isWiki?: boolean
  // noUnderline?: boolean
  id?: string
}
export interface NormalLinkProps {
  href: string
  children: string
}

import { noteStyle, outlineNoteStyle } from '../NoteStyle'
import { ExternalLinkIcon } from '@chakra-ui/icons'
//import { Section } from './Section'
//import { OrgRoamLink } from '../../api'
import { FilesData } from '../../utils/IDIndex/getFilesData'
import { ProcessedOrg } from '../ProcessedOrg'
import { slugify } from '../../utils/slug'
import { ParsedOrg } from '../../server/parseOrg'

export const NodeLink = (props: NodeLinkProps) => {
  const {
    //  noUnderline,
    //  setSidebarHighlightedNode,
    //  setPreviewNode,
    //n  nodeById,
    //  openContextMenu,
    href,
    children,
    data,
    //  isWiki,
  } = props

  // const theme = useTheme()
  // const type = href.replaceAll(/(.*?)\:?.*/g, '$1')
  // const uri = href.replaceAll(/.*?\:(.*)/g, '$1')
  //const ID = id ?? uri
  //const linkText = isWiki ? `[[${children}]]` : children
  return (
    <Text
      as="a"
      tabIndex={0}
      display="inline"
      overflow="hidden"
      fontWeight={600}
      color="red.500"
      //   color={highlightColor}
      //textDecoration={noUnderline ? undefined : 'underline'}
      // onContextMenu={(e) => {
      //   e.preventDefault()
      //   openContextMenu(nodeById[uri], e)
      //  }}
      //  onClick={() => setPreviewNode(nodeById[uri])}
      // TODO  don't hardcode the opacitycolor
      _hover={{
        textDecoration: 'none',
        cursor: 'pointer',
        //   bgColor: coolHighlightColor + '22'
      }}
      //  _focus={{ outlineColor: highlightColor }}
    >
      <Link href={href}>{children}</Link>
    </Text>
  )
}

export const NormalLink = (props: NormalLinkProps) => {
  const { href, children } = props
  //const { highlightColor } = useContext(ThemeContext)
  return (
    <Link isExternal href={href}>
      {children}
      <ExternalLinkIcon mx="1px" pb="2px" />
    </Link>
  )
}

export const PreviewLink = (props: LinkProps) => {
  const { href, data, title, orgText, children } = props
  // TODO figure out how to properly type this
  // see https://github.com/rehypejs/rehype-react/issues/25
  const [hover, setHover] = useState(false)

  // const file = encodeURIComponent(encodeURIComponent(data[id]?.file as string))

  if (!href) {
    return (
      <Text as="span" display="inline" className={href} color="base.700" cursor="not-allowed">
        {children}
      </Text>
    )
  }

  return (
    <>
      <Popover gutter={12} trigger="hover" placement="top-start">
        <PopoverTrigger>
          <Box
            display="inline"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <NodeLink
              key={title}
              {...{
                href,
                children,
                data,
              }}
            />
          </Box>
        </PopoverTrigger>
        <Portal>
          <PopoverContent
            transform="scale(1)"
            key={title}
            boxShadow="xl"
            position="relative"
            zIndex="tooltip"
          >
            <PopoverArrow />
            <PopoverBody
              pb={5}
              fontSize="xs"
              position="relative"
              zIndex="tooltip"
              transform="scale(1)"
              width="100%"
              maxHeight={300}
              overflowY="scroll"
            >
              <Box
                w="100%"
                // color="black"
                px={3}
                sx={noteStyle}
                //overflowY="scroll"
              >
                <Heading size="sm">{title}</Heading>
                <ParsedOrg
                  text={orgText}
                  //previewText={orgText}
                  // previewNode={nodeById[id]!}
                  //collapse={false}
                />
              </Box>
            </PopoverBody>
          </PopoverContent>
        </Portal>
      </Popover>
    </>
  )
}

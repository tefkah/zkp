/* eslint-disable react/display-name */
import {
  Link as ChakraLink,
  Box,
  Button,
  Heading,
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
  Container,
} from '@chakra-ui/react'
import Link from 'next/link'
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
  id?: string
  children: any
  data: FilesData
  currentId: string
  //orgText: string
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
  currentId: string
  //openContextMenu: any
  // isWiki?: boolean
  // noUnderline?: boolean
  id?: string
}
export interface NormalLinkProps {
  href: string
  children: string
}

import { noteStyle } from '../NoteStyle'
import { ExternalLinkIcon } from '@chakra-ui/icons'
//import { Section } from './Section'
//import { OrgRoamLink } from '../../api'
import { FilesData } from '../../utils/IDIndex/getFilesData'
import { ProcessedOrg } from '../ProcessedOrg'
import { slugify } from '../../utils/slug'
import { ParsedOrg } from '../../services/thesis/parseOrg'
import { PopoverPreview } from './PopoverPreview'
import { useRouter } from 'next/router'

export const NodeLink = (props: NodeLinkProps) => {
  const {
    //  noUnderline,
    //  setSidebarHighlightedNode,
    //  setPreviewNode,
    //n  nodeById,
    //  openContextMenu
    currentId,
    id,
    href,
    children,
    data,
    //  isWiki,
  } = props

  const router = useRouter()
  // const theme = useTheme()
  // const type = href.replaceAll(/(.*?)\:?.*/g, '$1')
  // const uri = href.replaceAll(/.*?\:(.*)/g, '$1')
  //const ID = id ?? uri
  //const linkText = isWiki ? `[[${children}]]` : children
  return (
    <Text
      as="span"
      tabIndex={0}
      display="inline"
      overflow="hidden"
      fontWeight={600}
      color="primary"
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
      <Link href={href}>
        <a
          onClick={(e) => {
            e.preventDefault()
            if (id && router.asPath?.includes(id)) {
              // TODO: scroll to id
              return
            }
            if (router.asPath.replace(/.*\//, '') === currentId) {
              router.push(`${router.asPath}/${id}`)
              return
            }
            // truncate the path to the current id
            const truncatedPath = router.asPath.replace(new RegExp(`(.*?\/${currentId}).*`), '$1')
            router.push(`${truncatedPath}/${id}`)
          }}
        >
          {children}
        </a>
      </Link>
    </Text>
  )
}

export const NormalLink = (props: NormalLinkProps) => {
  const { href, children } = props
  //const { highlightColor } = useContext(ThemeContext)
  return (
    <ChakraLink isExternal href={href}>
      {children}
      <ExternalLinkIcon mx="1px" pb="2px" />
    </ChakraLink>
  )
}

export const PreviewLink = (props: LinkProps) => {
  const { id, href, data, title, children, currentId } = props

  if (!href) {
    return (
      <Text as="span" display="inline" className={href} color="base.700" cursor="not-allowed">
        {children}
      </Text>
    )
  }

  return (
    <>
      <Popover
        closeOnEsc
        gutter={12} //openDelay={300}
        trigger="hover"
        placement="bottom-start"
        isLazy
      >
        <PopoverTrigger>
          <Text as="span">
            <NodeLink
              key={title}
              {...{
                currentId,
                id,
                href,
                children,
                data,
              }}
            />
          </Text>
        </PopoverTrigger>
        <PopoverContent
          key={title}
          boxShadow="sm"
          w="container.xs"
          borderRadius="xs"
          // position="relative" // zIndex="tooltip"
        >
          <PopoverArrow />
          <PopoverBody
            as={Container}
            pb={5}
            fontSize="xs"
            maxW="container.xs"
            //zIndex="tooltip"
            maxHeight={300}
            overflowY="scroll"
          >
            <PopoverPreview {...{ href, id, title }} />
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  )
}

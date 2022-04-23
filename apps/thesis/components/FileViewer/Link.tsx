/* eslint-disable react/display-name */
import {
  Link as ChakraLink,
  Box,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Text,
  Container,
} from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'

import shallow from 'zustand/shallow'
// import createStream from 'unified-stream'
// import highlight from 'rehype-highlight'
import 'katex/dist/katex.css'

import { ExternalLinkIcon } from '@chakra-ui/icons'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import { noteStyle } from '../NoteStyle'
// import { Section } from './Section'
// import { OrgRoamLink } from '../../api'
import { FilesData } from '../../utils/IDIndex/getFilesData'
import { ParsedOrg } from '../../services/thesis/parseOrg'
import { PopoverPreview } from './PopoverPreview'
import { useNotes } from '../../stores/noteStore'

export interface LinkProps {
  backlink?: boolean
  title: string
  href: any
  id?: string
  children: any
  data: FilesData
  currentId: string
  // orgText: string
  // outline: boolean
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
  // openContextMenu: any
  // isWiki?: boolean
  // noUnderline?: boolean
  id?: string
}
export interface NormalLinkProps {
  href: string
  children: string
}

export const NodeLink = (props: NodeLinkProps) => {
  const {
    //  noUnderline,
    //  setSidebarHighlightedNode,
    //  setPreviewNode,
    // n  nodeById,
    //  openContextMenu
    currentId,
    id,
    href,
    children,
    data,
    //  isWiki,
  } = props

  const router = useRouter()
  const [
    noteWidth,
    stackedNotesState,
    scrollContainer,
    scrollToId,
    setHighlightedNote,
    unHighlightNotes,
  ] = useNotes(
    (state) => [
      state.noteWidth,
      state.stackedNotesState,
      state.scrollContainer,
      state.scrollToId,
      state.setHighlightedNote,
      state.unHighlightNotes,
    ],
    shallow,
  )
  // const theme = useTheme()
  // const type = href.replaceAll(/(.*?)\:?.*/g, '$1')
  // const uri = href.replaceAll(/.*?\:(.*)/g, '$1')
  // const ID = id ?? uri
  // const linkText = isWiki ? `[[${children}]]` : children
  return (
    <Text
      as="span"
      tabIndex={0}
      display="inline"
      overflow="hidden"
      fontWeight={600}
      color="primary"
      //   color={highlightColor}
      // textDecoration={noUnderline ? undefined : 'underline'}
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
      <Link passHref href={href}>
        <a
          role="link"
          onMouseEnter={() => id && setHighlightedNote(id)}
          onMouseLeave={() => unHighlightNotes()}
          onClick={(e) => {
            e.preventDefault()
            if (id && router.asPath.includes(id)) {
              scrollToId({ id, stackedNotesState, noteWidth, ref: scrollContainer })
              // TODO: scroll to id
              return
            }
            if (router.asPath.replace(/.*\//, '') === currentId) {
              const url = `${router.asPath}/${id}`
              router.push(url, url, { shallow: true })
              return
            }
            // truncate the path to the current id
            const truncatedPath = router.asPath.replace(new RegExp(`(.*?\/${currentId}).*`), '$1')
            const url = `${truncatedPath}/${id}`
            router.push(url, url, { shallow: true })

            //   if (id && router.query?.stack?.includes(id)) {
            //     // TODO: scroll to id
            //     return
            //   }
            //   if (router.query?.stack?.includes(currentId)) {
            //     if (router.query?.stack) {
            //       const url = `${router.asPath}&stack=${id}`
            //       router.push(url, url, { shallow: true })
            //     }
            //     const url = `${router.asPath}?stack=${id}`
            //     router.push(url, url, { shallow: true })
            //     return
            //   }
            //   // truncate the path to the current id
            //   const truncatedPath = router.asPath.replace(
            //     new RegExp(`(.*?stack=${currentId}).*`),
            //     '$1',
            //   )
            //   if (router.query?.stack) {
            //     const url = `${truncatedPath}&stack=${id}`
            //     router.push(url, url, { shallow: true })
            //   }
            //   const url = `${truncatedPath}?stack=${id}`
            //   router.push(url, url, { shallow: true })
            // }}
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
  // const { highlightColor } = useContext(ThemeContext)
  return (
    <ChakraLink isExternal href={href}>
      {children}
      <ExternalLinkIcon mx="1px" pb="2px" />
    </ChakraLink>
  )
}

export const PreviewLink = (props: LinkProps) => {
  const { id, backlink, href, data, title, children, currentId } = props
  const { data: text } = useSWR(backlink ? `/api/file/byId/${id}` : null)

  if (!href) {
    return (
      <Text as="span" display="inline" className={href} color="base.700" cursor="not-allowed">
        {children}
      </Text>
    )
  }

  return (
    <Popover
      closeOnEsc
      gutter={12} // openDelay={300}
      trigger="hover"
      placement="bottom-start"
      isLazy
      lazyBehavior="keepMounted"

      // isLazy
    >
      <PopoverTrigger>
        {backlink ? (
          <Box sx={noteStyle} color="brand.700">
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
            <ParsedOrg type="popover" text={text?.file} currentId={currentId} />
          </Box>
        ) : (
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
        )}
      </PopoverTrigger>
      <Portal>
        <PopoverContent
          boxShadow="md"
          key={title}
          // position="relative" // zIndex="tooltip"
        >
          <PopoverArrow />
          <PopoverBody
            as={Container}
            pb={5}
            fontSize="xs"
            maxW="xs"
            // zIndex="tooltip"
            maxH="2xs"
            overflowY="scroll"
            borderRadius="sm"
          >
            <PopoverPreview {...{ href, id, title }} />
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  )
}

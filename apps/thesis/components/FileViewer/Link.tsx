/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/display-name */
import {
  Link as ChakraLink,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  Portal,
  Text,
  Container,
  PopoverTrigger as OrigPopoverTrigger,
} from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'

import shallow from 'zustand/shallow'
// import createStream from 'unified-stream'
// import highlight from 'rehype-highlight'
import 'katex/dist/katex.css'

import { ExternalLinkIcon } from '@chakra-ui/icons'
import { useRouter } from 'next/router'
// import useSWR from 'swr'
// import { noteStyle } from '../NoteStyle'
// import { Section } from './Section'
// import { OrgRoamLink } from '../../api'
// import { ParsedOrg } from '../../services/thesis/parseOrg'
import { PopoverPreview } from './PopoverPreview'
import { useNotes } from '../../stores/noteStore'

export const PopoverTrigger: React.FC<{ children: React.ReactNode }> = OrigPopoverTrigger
export interface LinkProps {
  backlink?: boolean
  title?: string
  href: any
  children: any
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
  currentId: string
  // openContextMenu: any
  // isWiki?: boolean
  // noUnderline?: boolean
}
export interface NormalLinkProps {
  href: string
  children: string
}

/**
 * TODO: Extract this to a separate component
 */
export const NodeLink = (props: NodeLinkProps) => {
  const {
    //  noUnderline,
    //  setSidebarHighlightedNode,
    //  setPreviewNode,
    // n  nodeById,
    //  openContextMenu
    currentId,
    href,
    children,
    //  isWiki,
  } = props

  const router = useRouter()
  const {
    noteWidth,
    stackedNotesState,
    scrollContainer,
    scrollToId,
    setHighlightedNote,
    unHighlightNotes,
  } = useNotes(
    (state) => ({
      noteWidth: state.noteWidth,
      stackedNotesState: state.stackedNotesState,
      scrollContainer: state.scrollContainer,
      scrollToId: state.scrollToId,
      setHighlightedNote: state.setHighlightedNote,
      unHighlightNotes: state.unHighlightNotes,
    }),
    shallow,
  )

  const linkTarget = href.replace(/^\//, '')
  const scroll = () =>
    scrollToId({ id: linkTarget, stackedNotesState, noteWidth, ref: scrollContainer })
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
          onMouseEnter={() => linkTarget && setHighlightedNote(linkTarget)}
          onMouseLeave={() => unHighlightNotes()}
          onClick={async (e) => {
            e.preventDefault()

            const basepath = router.asPath.replace(/(.*?)\?s.*/, '$1')
            const safeQuery = router.query.s
              ? Array.isArray(router.query.s)
                ? router.query.s
                : [router.query.s]
              : []

            if (!router.query.s) {
              await router.push(
                {
                  pathname: basepath,
                  query: { ...router.query, s: [...safeQuery, linkTarget] },
                },
                {
                  pathname: basepath,
                  query: { s: [...safeQuery, linkTarget] },
                },
                { shallow: true },
              )
              scroll()
              return
            }

            if (linkTarget && safeQuery.includes(linkTarget)) {
              scroll()
              return
            }

            const index = safeQuery.indexOf(currentId)

            const newQ = index > -1 ? safeQuery.slice(0, index + 1) : safeQuery

            await router.push(
              {
                pathname: basepath,
                query: { ...router.query, s: [...(newQ ?? []), linkTarget] },
              },
              {
                pathname: basepath,
                query: { s: [...(newQ ?? []), linkTarget] },
              },
              { shallow: true },
            )
            scroll()
            /*            if (router.asPath.replace(/.*\//, '') === currentId) {
              const url = `${router.asPath}/${id}`
              router.push(url, url, { shallow: true })
              return
            }

            // truncate the path to the current id
            if()
            const truncatedPath =  .replace(new RegExp(`(.*?\/${currentId}).*`), '$1') */
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
  const { backlink, href, title, children, currentId } = props
  //  const { data: text } = useSWR(backlink ? `/api/file/byId/${id}` : null)

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
          {
            /* <Box sx={noteStyle} color="brand.700">
            <NodeLink key={title} currentId={currentId} href={href}>
              {children}
            </NodeLink>
            <ParsedOrg type="popover" text={text?.file} currentId={currentId} />
        </Box> */
          }
        ) : (
          <Text as="span">
            <NodeLink key={title} currentId={currentId} href={href}>
              {children}
            </NodeLink>
          </Text>
        )}
      </PopoverTrigger>
      <Portal>
        <PopoverContent
          boxShadow="md"
          key={href}
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
            <PopoverPreview {...{ href, id: currentId }} />
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  )
}

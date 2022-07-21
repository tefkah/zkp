import { useRouter } from 'next/router'
import Link from 'next/link'
import shallow from 'zustand/shallow'
import { ReactNode } from 'react'
// import { useNotes } from '../../stores/noteStore'

export interface NodeLinkProps {
  href: string
  children: ReactNode
  currentId: string
  // openContextMenu: any
  // isWiki?: boolean
  // noUnderline?: boolean
}

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
    // <Text as="span"
    //   tabIndex={0}
    //   display="inline"
    //   overflow="hidden"
    //   fontWeight={600}
    //   color="primary"
    //   //   color={highlightColor}
    //   // textDecoration={noUnderline ? undefined : 'underline'}
    //   // onContextMenu={(e) => {
    //   //   e.preventDefault()
    //   //   openContextMenu(nodeById[uri], e)
    //   //  }}
    //   //  onClick={() => setPreviewNode(nodeById[uri])}
    //   // TODO  don't hardcode the opacitycolor
    //   _hover={{
    //     textDecoration: 'none',
    //     cursor: 'pointer',
    //     //   bgColor: coolHighlightColor + '22'
    //   }}
    //   //  _focus={{ outlineColor: highlightColor }}
    // >
    <Link passHref href={href}>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid, jsx-a11y/click-events-have-key-events, jsx-a11y/anchor-is-valid, jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <a
        // as="span"
        // role="link"
        className="text-red-500 decoration-transparent"
        onMouseEnter={() => linkTarget && setHighlightedNote(linkTarget)}
        onMouseLeave={() => unHighlightNotes()}
        onClick={async (e) => {
          e.preventDefault()

          const basepath = router.asPath.replace(/(.*?)\?s.*/, '$1')
          // eslint-disable-next-line no-nested-ternary
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
    // </Text>
  )
}

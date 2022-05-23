import shallow from 'zustand/shallow'
import { CSSObject, useColorMode, CloseButton } from '@chakra-ui/react'
import React, { useMemo } from 'react'
import useSWR from 'swr'
import { Waveform } from '@uiball/loaders'
import dynamic from 'next/dynamic'
// import { AiOutlineConsoleSql } from 'react-icons/ai'

// import { NoteHeading, CommitPerDateLog, CSLCitation, StackState } from '../../types'
// import { OrgFileData } from '../../utils/IDIndex/getDataFromFile'
// import { FilesData } from '../../utils/IDIndex/getFilesData'
// import { parseTime } from '../../utils/parseTime'
import { useRouter } from 'next/router'
import { OutlineBox } from '../OutlineBox/OutlineBox'
// import { ProcessedOrg } from '../ProcessedOrg'
// import { Backlinks } from './Backlinks'
// import { Citations } from './Citations'
import { useNotes } from '../../stores/noteStore'
import { MDXNote } from './MDXNote'
import { FilePageProps } from '../../types'

export interface NoteProps extends FilePageProps {
  // stackData?: StackState
  index: number
  // ref?: any
}

const CommentBoxMaybe = dynamic(() => import('../Comments/CommentBoxMaybe'))

export const BaseNote = React.forwardRef((props: NoteProps, ref: any) => {
  const { index, toc, stackedNotes, source, id, commits } = props

  const stacked = (stackedNotes?.length ?? 0) > 1
  const router = useRouter()

  const { obstructedPageWidth, noteWidth, getStackStateById } = useNotes(
    (state) => ({
      obstructedPageWidth: state.obstructedPageWidth,
      noteWidth: state.noteWidth,
      getStackStateById: state.getStackStateById,
      // removeNoteById: state.removeNoteById,
    }),
    shallow,
  )

  const removeNote = () => {
    const basepath = router.asPath.replace(/(.*?)\?s.*/, '$1')
    if (typeof router.query.s === 'string') {
      router.push(basepath, { pathname: basepath, query: {} }, { shallow: true })
      return
    }
    const q = router.query.s?.filter((thing) => thing !== id)

    router.push(
      { pathname: basepath, query: { ...router.query, ...(q ? { s: q } : {}) } },
      { pathname: basepath, query: { ...(q ? { s: q } : {}) } },
      {
        shallow: true,
      },
    )
  }

  const { colorMode } = useColorMode()
  const stackData = getStackStateById(id)
  const { data } = useSWR(`/data/dataBySlug.json`)

  const stackedNoteStyle: CSSObject = stacked
    ? {
        borderStyle: 'solid',
        borderLeftWidth: '1px',
        flexShrink: '0',
        width: '75ch',
      }
    : {}

  const highlightedStyle: CSSObject = stackData?.highlighted
    ? {
        backgroundColor: 'brand.100',
      }
    : {}
  const overlayStyle: CSSObject = stackData?.overlay
    ? {
        boxShadow: '2xl',
      }
    : {}
  const obstructedStyle: CSSObject = stackData?.obstructed ? {} : {}

  const Note = useMemo(
    () => (
      <div
        className={`container flex w-[75ch] flex-grow flex-col justify-between py-8 ${
          stackData?.obstructed ? 'opacity-0' : 'opacity-1'
        }`}
      >
        {/*         <HStack my={2} spacing={2}>
          {!tags?.includes('chapter') &&
            tags?.map((tag: string) => (
              <Tag key={tag} size="sm" variant="outline">
                {tag}
              </Tag>
            ))}
        </HStack> */}
        {/*         <VStack mb={4} spacing={0.5} alignItems="flex-start">
          {ctime && (
            <Text fontSize={12} color="gray.500">
              Created on{' '}
              <Text fontWeight={500} as="span" color="gray.600">
                {parseTime(ctime)}
              </Text>
            </Text>
          )}
          {mtime && (
            <Text fontSize={12} color="gray.500">
              Last modified{' '}
              <Text as="span" fontWeight={500} color="gray.600">
                {' '}
                {parseTime(mtime)}
              </Text>
            </Text>
          )}
        </VStack> */}
        <MDXNote source={source} currentId={id} />
        {/* backLinks?.length && <Backlinks {...{ currentId: id, backLinks }} /> */}
        {!data ? <Waveform /> : <CommentBoxMaybe show={stacked} title={data?.[id]?.name} />}
        {/* !stacked && <CommentBox {...{ title }} /> */}
      </div>
    ),
    [stacked, id, source, data],
  )

  const bgLight = stackData?.highlighted ? 'bg-red-100' : 'bg-white'
  const bgDark = stackData?.highlighted ? 'bg-red-100' : 'bg-black'
  return (
    <div
      className={`sticky flex w-[75ch]
      flex-grow overflow-y-scroll scroll-smooth p-4 transition-all
      ${stacked ? 'justify-start' : 'justify-between'}
      h-full
       ${bgLight}
      dark:bg-black
      `}
      ref={ref}
      // sx={{
      //   padding: 4,
      //   backgroundColor: colorMode === 'dark' ? 'dark.primary' : 'white',
      //   // maxH: '95vh',
      //   position: 'sticky',
      //   flexGrow: 1,
      //   overflowY: 'scroll',
      //   scrollBehavior: 'smooth',

      style={{
        transition:
          'box-shadow 100ms linear, opacity 75ms linear, transform 200ms cubic-bezier(0.19, 1, 0.22, 1), background-color 0.3s ease',
        left: `${obstructedPageWidth * (index || 0)}px`,
        right: `${
          -noteWidth + (obstructedPageWidth * ((stackedNotes?.length ?? 0) - index) || 0)
        }px`,
        //   left: `${obstructedPageWidth * (index || 0)}px`,
        //   right: `${
        //     -noteWidth + (obstructedPageWidth * ((stackedNotes?.length ?? 0) - index) || 0)
        //   }px`,
        ...stackedNoteStyle,
        ...overlayStyle,
        ...obstructedStyle,
        ...highlightedStyle,
      }}
      // }}
      //   justifyContent={stacked ? 'flex-start' : 'space-between'}
      //  height="full"
    >
      {stacked && (
        <div className="justify-bottom flex align-bottom">
          <CloseButton onClick={removeNote} />
          <h1
            className={`text-md text-regular ] top-0 left-0 bottom-0 overflow-hidden bg-transparent decoration-0 ${
              stackData?.obstructed ? 'opacity-1' : 'opacity-0'
            } pointer-events-none absolute mt-14 whitespace-nowrap transition-colors transition-opacity`}
            // size="md"
            // TODO: do not inline all the stacked note styles
            style={{
              width: `${obstructedPageWidth ?? 0}px`,
              // textDecoration: 'none',
              // fontSize: '17px',
              lineHeight: `${obstructedPageWidth}px`,
              // fontWeight: '500',
              // marginTop: 14,
              // top: '0px',
              // bottom: '0px',
              // left: '0px',
              // position: 'absolute',
              // backgroundColor: 'transparent',
              // width: `${obstructedPageWidth}px`,
              writingMode: 'vertical-lr',
              textOrientation: 'sideways',
              // overflow: 'hidden',
              // opacity: stackData?.obstructed ? 1 : 0,
              // transition: 'color 0.3s ease, opacity 0.1s ease',
              // pointerEvents: 'none',
              // whiteSpace: 'nowrap',
            }}
          >
            {data?.[id]?.name ?? id}
          </h1>
        </div>
      )}
      {Note}
      {!stacked && <OutlineBox {...{ headings: toc, commits }} />}
    </div>
  )
})

BaseNote.displayName = 'BaseNote'

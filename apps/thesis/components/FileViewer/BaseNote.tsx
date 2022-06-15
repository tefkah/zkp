import shallow from 'zustand/shallow'
import { CSSObject, useColorMode, CloseButton } from '@chakra-ui/react'
import React, { useMemo } from 'react'
import useSWR from 'swr'
import { Waveform } from '@uiball/loaders'
import dynamic from 'next/dynamic'
// import { AiOutlineConsoleSql } from 'react-icons/ai'

// import { NoteHeading, CommitPerDateLog, CSLCitation, StackState } from '@zkp/types'
// import { OrgFileData } from '../../utils/IDIndex/getDataFromFile'
// import { FilesData } from '../../utils/IDIndex/getFilesData'
// import { parseTime } from '../../utils/parseTime'
import { useRouter } from 'next/router'
import { FilePageProps } from '@zkp/types'
import { CommentThreadProps, WidgetProps } from '@zkp/discus'
import { OutlineBox } from '../OutlineBox/OutlineBox'
// import { ProcessedOrg } from '../ProcessedOrg'
// import { Backlinks } from './Backlinks'
// import { Citations } from './Citations'
import { useNotes } from '../../stores/noteStore'
import { MDXNote } from './MDXNote'
import { Button } from '@zkp/ui'
// import CommentBoxMaybe from '../Comments/CommentBoxMaybe'
export interface NoteProps extends FilePageProps {
  // stackData?: StackState
  index: number
  // ref?: any
}

const Widget = dynamic<CommentThreadProps>(
  () => import('@zkp/discus').then((module) => module.CommentThread),
  {
    ssr: false,
  },
)

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

  // const { colorMode } = useColorMode()
  const stackData = getStackStateById(id)
  const { data } = useSWR(`/data/dataBySlug.json`)

  // const obstructedStyle: CSSObject = stackData?.obstructed ? {} : {}

  const Note = useMemo(
    () => (
      <div
        className={`container flex w-[90ch] flex-grow flex-col justify-between py-8 ${
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
        {!data ? (
          <Waveform />
        ) : (
          <Widget
            // show={stacked}
            // repo="ThomasFKJorna/thesis-discussions"
            // repoId="R_kgDOGiFakw"
            // category="Feedback"
            // categoryId="DIC_kwDOGiFak84CASa-"
            // term={data?.[id]?.name}
            // origin=""
            // description=""
            title={data?.[id]?.name}
          />
        )}
        {/* !stacked && <CommentBox {...{ title }} /> */}
      </div>
    ),
    [stacked, id, source, data],
  )

  const bgLight = stackData?.highlighted ? 'bg-red-100' : 'bg-white'
  // const bgDark = stackData?.highlighted ? 'bg-red-100' : 'bg-black'
  return (
    <div
      className={`sticky flex w-[90ch]
      flex-grow overflow-y-scroll scroll-smooth p-4 transition-all
      ${stacked ? 'flex-shrink-0 justify-start border-l-[1px]' : 'justify-between'}
      h-full
       ${bgLight}
      dark:bg-black
      ${stackData?.highlighted ? 'bg-red-50' : ''}
      ${stackData?.overlay ? 'shadow-xl' : ''}
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
        // ...stackedNoteStyle,
        // ...highlightedStyle,
      }}
      // }}
      //   justifyContent={stacked ? 'flex-start' : 'space-between'}
      //  height="full"
    >
      {stacked && (
        <div className="justify-bottom align-center flex flex-col">
          <Button
            className="bg-transparent p-1 text-red-300 hover:bg-red-100 hover:text-red-500"
            onClick={removeNote}
          >
            x
          </Button>
          <h1
            className={`text-md text-regular ] top-0 left-0 bottom-0 overflow-hidden bg-transparent decoration-0 ${
              stackData?.obstructed ? 'opacity-1' : 'opacity-0'
            } pointer-events-none absolute mt-14 whitespace-nowrap transition-colors transition-opacity`}
            // TODO: do not inline all the stacked note styles
            style={{
              width: `${obstructedPageWidth ?? 0}px`,
              lineHeight: `${obstructedPageWidth}px`,
              writingMode: 'vertical-lr',
              textOrientation: 'sideways',
            }}
          >
            {data?.[id]?.name ?? id}
          </h1>
        </div>
      )}
      {Note}
      {/* {!stacked && <OutlineBox {...{ headings: toc, commits }} />} */}
    </div>
  )
})

BaseNote.displayName = 'BaseNote'

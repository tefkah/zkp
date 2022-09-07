/* eslint-disable no-nested-ternary */
import shallow from 'zustand/shallow'
import React, { useEffect, useMemo, useRef } from 'react'
import { useElementSize } from '@mantine/hooks'
import { useScroll } from 'react-use'
import { useRouter } from 'next/router'
import { InitialNoteCache } from '../../pages/[file]'
import { useNotes } from '../../stores/noteStore'
import { MDXNote } from './MDXNote'
import { MDXRemote } from 'next-mdx-remote'
import { createMdxRehypeReactCompents } from '../MDXComponents'
import Link from 'next/link'

export const NoteScrollContainer = (props: { data: InitialNoteCache }) => {
  // const { toc, source, id, commits } = data
  const { data } = props
  const [
    stackedNotesState,
    setStackedNotesState,
    updateStackedNotesState,
    setNoteWidth,
    setScrollContainer,
    obstructedOffset,
    obstructedPageWidth,
    scrollToEnd,
    noteWidth,
  ] = useNotes(
    (state) => [
      state.stackedNotesState,
      state.setStackedNotesState,
      state.updateStackedNotesState,
      state.setNoteWidth,
      state.setScrollContainer,
      state.obstructedOffset,
      state.obstructedPageWidth,
      state.scrollToEnd,
      state.noteWidth,
    ],
    shallow,
  )

  // const stackedNotes = useMemo(
  //   () => (Array.isArray(router.query.s) ? router.query.s : router.query.s ? [router.query.s] : []),
  //   [router.query.s],
  // )

  // const stacked = !!stackedNotes?.length
  // const allNotes = useMemo(() => [id, ...(stackedNotes || [])], [stackedNotes])
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const { x } = useScroll(scrollRef)
  const { ref: sizeRef, width } = useElementSize()

  useEffect(() => {
    setNoteWidth(width)
  }, [setNoteWidth, width])

  const propArr = useMemo(() => Object.entries(data), [data])
  /**
   * On mount, set the initial state
   */
  useEffect(() => {
    setStackedNotesState(
      Object.fromEntries(
        propArr.map(([key, value], idx) => [
          key,
          {
            ...value,
            obstructed: false,
            highlighted: false,
            overlay: x > width - obstructedOffset,
            active: true,
            index: idx,
          },
        ]),
      ),
    )
  }, [])

  /**
   * Put scrollref in the store. There's not really any hurry with this,
   * as a user will almost certainly either scroll or open a new note before
   * having to use the scrollRef stored in the store, which is mostly for scrolling
   * to already opened notes.
   */
  useEffect(() => {
    setScrollContainer(scrollRef)
  }, [scrollRef.current])

  /**
   * Scroll to last note when the number of notes changes.
   */
  useEffect(() => {
    setTimeout(() => {
      scrollToEnd(scrollRef)
    }, 20)
  }, [scrollRef, propArr?.length])

  /**
   * Update the stack state on scroll and note-change
   */
  useEffect(() => {
    if (propArr.length === 1) {
      return
    }
    updateStackedNotesState({
      x,
      width,
      obstructedOffset,
      obstructedPageWidth,
      allNotes: Object.keys(data),
    })
  }, [propArr, scrollRef, x, setStackedNotesState])

  return (
    <div
      className="transition-[width 100ms cubic-bezier(0.19, 1, 0.22, 1)] flex h-full w-full items-start justify-center gap-0 overflow-x-scroll"
      ref={scrollRef}
      // overflowX="scroll"
      // alignItems="top"
      // transition="width 100ms cubic-bezier(0.19, 1, 0.22, 1)"
      // spacing={0}
      // // flex={1}
      // justifyContent={stackedNotes?.length ? 'flex-start' : 'center'}
      // // justifyContent="space-between"
      // height="100%"
    >
      {Object.values(data).map(({ data: d }, idx) => (
        <div
          className={`sticky flex
      flex-grow overflow-y-scroll scroll-smooth p-8 transition-all
      ${stackedNotesState[d.slug]?.highlighted ? 'bg-red-100' : 'bg-white'}
      ${
        //     stacked ?
        'w-[55ch] flex-shrink-0 justify-start border-l-[1px]' //: 'w-[90ch] justify-between'
      }

      ${stackedNotesState?.[d.slug]?.overlay ? 'shadow-xl' : ''}
      h-full
      dark:bg-black
      ${stackedNotesState[d.slug]?.highlighted ? 'bg-red-50' : ''}
      ${stackedNotesState[d.slug]?.overlay ? 'shadow-xl' : ''}
      `}
          // ref={ref}
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
            left: `${obstructedPageWidth * (idx || 0)}px`,
            right: `${-noteWidth + (obstructedPageWidth * ((propArr?.length ?? 0) - idx) || 0)}px`,
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
          key={d.slug}
        >
          <MedNote data={d} />
        </div>
      ))}
      {/* <BaseNote
        ref={sizeRef}
        {...{
          toc,
          source,
          stacked,
          id,
          commits,
          index: 0,
          stackedNotes: allNotes,
        }}
      />
      {stacked &&
        stackedNotes &&
        stackedNotes.map((note: string, index: number) => (
          <StackedNote
            key={`${note}`}
            {...{
              stackedNotes: allNotes,
              index: index + 1,
              id: note,
              stackData: stackedNotesState[note],
            }}
          />
        ))} */}
    </div>
  )
}

export const MedNote = (props: { data: InitialNoteCache[string]['data'] }) => {
  const { data: d } = props

  // const mdx = useMemo(
  //   () => <MDXNote markdownContent={d.contentMarkdown} currentId={d.slug} />,
  //   [d.markdownContent],
  // )
  const comp = useMemo(() => createMdxRehypeReactCompents(d.slug), [d.contentMarkdown])

  const router = useRouter()
  const mdx = useMemo(
    () => <MDXRemote compiledSource={d.content?.source.compiledSource} components={comp} />,
    [comp, d.content?.source.compiledSource],
  )
  if (!d.content?.source) return null
  return (
    // <div key={d.slug} className="min-w-[60ch]">
    // <>{mdx}</>
    <article className="prose prose-sm dark:prose-invert">
      <Link
        href={{
          query: {
            file: router.query.file,
            s: Array.isArray(router.query.s) ? router.query.s?.filter((s) => s !== d.slug) : '',
          },
        }}
      >
        x
      </Link>
      {mdx}
    </article>
  )
}

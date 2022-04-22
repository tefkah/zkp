import { Text, HStack, Box, Button, useMergeRefs } from '@chakra-ui/react'
import shallow from 'zustand/shallow'
import React, { MutableRefObject, useEffect, useMemo, useRef, useState } from 'react'
import { FilePageProps } from '../../pages/[...file]'
import { BaseNote } from './BaseNote'
import { StackedNote } from './StackedNote'
import { useMeasure, useScroll } from 'react-use'
import { useElementSize } from '@mantine/hooks'
import { useRouter } from 'next/router'
import { useNotes } from '../../stores/noteStore'

interface NoteScrollContainerProps extends FilePageProps {}

const getNoteScrollX = (i: number, paneWidth: number) => i * paneWidth

const scrollToPane = (
  ref: MutableRefObject<HTMLDivElement | null>,
  i: number,
  paneWidth: number,
) => {
  ref.current?.scrollTo({
    left: i * paneWidth,
    behavior: 'smooth',
  })
}

export interface StackState {
  obstructed: boolean
  highlighted: boolean
  overlay: boolean
  active: boolean
  /**
   * Mostly because object order is not guaranteed
   */
  index: number
}

export interface StackedNotesState {
  [id: string]: StackState
}

export const NoteScrollContainer = (props: FilePageProps) => {
  const { toc, fileData, page, data, slug, commits, csl } = props

  const router = useRouter()

  const stackedNotes = useMemo(
    () => router.asPath.match(/([\d\w]{8}-([\d\w]{4}-){3}[\d\w]{12})/g),
    [router.asPath],
  )

  const stacked = !!stackedNotes?.length
  const allNotes = useMemo(() => [fileData.id, ...(stackedNotes || [])], [fileData, stackedNotes])
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const { x, y } = useScroll(scrollRef)
  const { ref: sizeRef, width, height } = useElementSize()

  const [
    stackedNotesState,
    setStackedNotesState,
    updateStackedNotesState,
    noteWidth,
    setNoteWidth,
    scrollToId,
    setScrollContainer,
    obstructedOffset,
    obstructedPageWidth,
    scrollToEnd,
  ] = useNotes(
    (state) => [
      state.stackedNotesState,
      state.setStackedNotesState,
      state.updateStackedNotesState,
      state.noteWidth,
      state.setNoteWidth,
      state.scrollToId,
      state.setScrollContainer,
      state.obstructedOffset,
      state.obstructedPageWidth,
      state.scrollToEnd,
    ],
    shallow,
  )

  useEffect(() => {
    setNoteWidth(width)
  }, [width])
  /**
   * On mount, set the initial state
   */
  useEffect(() => {
    setStackedNotesState({
      [fileData.id]: {
        obstructed: false,
        highlighted: false,
        overlay: x > width - obstructedOffset,
        active: true,
        index: 0,
      },
    })
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
    //if (!stackedNotes) return
    setTimeout(() => {
      scrollToEnd(scrollRef)
    }, 20)
  }, [scrollRef, stackedNotes?.length])

  /**
   * Update the stack state on scroll and note-change
   */
  useEffect(() => {
    if (allNotes.length === 1) {
      return
    }
    updateStackedNotesState({ x, width, obstructedOffset, obstructedPageWidth, allNotes })
  }, [stackedNotes, scrollRef, x, setStackedNotesState])

  return (
    <HStack
      ref={scrollRef}
      overflowX="scroll"
      alignItems="top"
      transition="width 100ms cubic-bezier(0.19, 1, 0.22, 1)"
      spacing={0}
      flex={1}
      justifyContent={stackedNotes?.length ? 'flex-start' : 'space-between'}
    >
      <BaseNote
        ref={sizeRef}
        {...{
          toc,
          fileData,
          page,
          data,
          stacked,
          slug,
          commits,
          csl,
          index: 0,
          stackedNotes: allNotes,
        }}
        stackData={stackedNotesState[fileData.id]}
      />
      {stacked &&
        stackedNotes?.map((note, index) => (
          <StackedNote
            key={`${note}${index}`}
            {...{
              stackedNotes: allNotes,
              index: index + 1,
              id: note,
              data,
              stackData: stackedNotesState[note],
            }}
          />
        ))}
      {/* <Text>
        {x}
        {y}
      </Text>
      <Text>
        W:{width}
        H:{height}
      </Text> */}
    </HStack>
  )
}

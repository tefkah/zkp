import { Text, HStack, Box, Button } from '@chakra-ui/react'
import React, { MutableRefObject, useEffect, useMemo, useRef, useState } from 'react'
import { FilePageProps } from '../../pages/[...file]'
import { BaseNote } from './BaseNote'
import { StackedNote } from './StackedNote'
import { useMeasure, useScroll } from 'react-use'
import { useElementSize } from '@mantine/hooks'
import { useRouter } from 'next/router'

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
const obstructedOffset = 120
const obstructedPageWidth = 40

export interface StackState {
  obstructed: boolean
  highlighted: boolean
  overlay: boolean
  active: boolean
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

  console.log(stackedNotes)
  const stacked = !!stackedNotes?.length
  const allNotes = [fileData.id, ...(stackedNotes || [])]
  const scrollRef = useRef<HTMLDivElement>(null)
  const { x, y } = useScroll(scrollRef)
  const { ref: sizeRef, width, height } = useElementSize()

  console.log(stackedNotes)
  const [stackedNotesState, setStackedNotesState] = useState({
    [fileData.id]: {
      obstructed: false,
      highlighted: false,
      overlay: x > width - obstructedOffset,
      active: true,
    },
  })

  /**
   * Scroll to last note when the number of notes changes.
   */
  useEffect(() => {
    scrollToPane(scrollRef, allNotes.length + 1, width)
  }, [stackedNotes, scrollRef, width])

  /**
   * Update the stack state on scroll and note-change
   */
  useEffect(() => {
    setStackedNotesState(
      allNotes.reduce((acc, curr, i, a) => {
        console.log({
          [i]: {
            x,
            length: Math.max(width * (i + 1) - obstructedOffset - obstructedPageWidth * (i - 1), 0),
          },
        })
        console.log({
          [i]: { left: x + width * (allNotes.length + 1), right: width * i + obstructedOffset },
        })

        acc[curr] = {
          highlighted: false,
          overlay:
            x > Math.max(width * (i - 1) - obstructedPageWidth * (i - 2), 0) ||
            x < Math.max(0, width * (i - 2)),
          obstructed:
            x > Math.max(width * (i + 1) - obstructedOffset - obstructedPageWidth * (i - 1), 0) ||
            x + width * (allNotes.length + 1) < width * i + obstructedOffset,
          active: i === a.length - 1,
        }
        return acc
      }, {} as typeof stackedNotesState),
    )
  }, [stackedNotes, scrollRef, x, setStackedNotesState])

  return (
    <HStack
      ref={scrollRef}
      overflowX="scroll"
      alignItems="top"
      transition="width 100ms cubic-bezier(0.19, 1, 0.22, 1)"
      spacing={0}
      flex={1}
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
        }}
        stackData={stackedNotesState[fileData.id]}
      />
      {stacked &&
        stackedNotes?.map((note, index) => (
          <StackedNote
            key={`${note}${index}`}
            {...{ index: index + 1, id: note, data, stackData: stackedNotesState[note] }}
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

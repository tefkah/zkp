import { MutableRefObject } from 'react'
import create from 'zustand'
import { combine } from 'zustand/middleware'
import { StackedNotesState } from '@zkp/types'

export interface InitialNoteState {
  stackedNotesState: StackedNotesState
  scrollContainer: React.RefObject<HTMLDivElement | null> | null
  noteWidth: number
  obstructedOffset: number
  obstructedPageWidth: number
}

export interface SetNoteState {
  scrollToIndex: ({
    ref,
    i,
    noteWidth,
  }: {
    ref: MutableRefObject<HTMLDivElement | null> | null
    i: number
    noteWidth: number
  }) => void
  scrollToId: ({
    stackedNotesState,
    ref,
    id,
    noteWidth,
  }: {
    stackedNotesState: StackedNotesState
    ref: MutableRefObject<HTMLDivElement | null> | null
    id: string
    noteWidth: number
  }) => void
  unHighlightNotes: () => void
  setHighlightedNote: (id: string) => void
  updateStackedNotesState: ({
    x,
    width,
    obstructedPageWidth,
    obstructedOffset,
  }: {
    allNotes: string[]
    x: number
    width: number
    obstructedPageWidth: number
    obstructedOffset: number
  }) => void
  setStackedNotesState: (stackedNotesState: StackedNotesState) => void
  setNoteWidth: (width: number) => void
  setScrollContainer: (ref: MutableRefObject<HTMLDivElement | null>) => void
  scrollToEnd: (ref: MutableRefObject<HTMLDivElement | null>) => void
  getStackStateById: (id: string) => StackedNotesState[typeof id]
  removeNoteById: (id: string) => void
}

export const useComments = create(
  combine<InitialNoteState, SetNoteState>(
    {
      stackedNotesState: {},
      scrollContainer: null,
      noteWidth: 600,
      obstructedOffset: 120,
      obstructedPageWidth: 40,
    },
    (set, get) => ({
      getStackStateById: (id: string) => get().stackedNotesState[id],
      setStackedNotesState: (stackedNotesState: StackedNotesState) =>
        set((state) => ({ ...state, stackedNotesState })),
      updateStackedNotesState: ({ allNotes, x, width, obstructedPageWidth, obstructedOffset }) =>
        set((state) => ({
          ...state,
          stackedNotesState: allNotes.reduce((acc, curr, i, a) => {
            acc[curr] = {
              highlighted: false,
              overlay:
                x > Math.max(width * (i - 1) - obstructedPageWidth * (i - 2), 0) ||
                x < Math.max(0, width * (i - 2)),
              // TODO: [bug] obstructed computation is increasingly off as i increases
              obstructed:
                x > Math.max(width * (i + 1) - obstructedPageWidth * (i - 1), 0) ||
                x + width * allNotes.length < width * i + obstructedOffset ||
                x < width * (i - 1 || 0) - obstructedPageWidth * i,
              active: i === a.length - 1,
              index: i,
            }
            return acc
          }, {} as StackedNotesState),
        })),
      unHighlightNotes: () =>
        set((state) => {
          /**
           * Saves a rerender if nothing was highlighted
           */
          let shouldRerender = false
          const stackedNotesState = Object.entries(state.stackedNotesState).reduce((acc, curr) => {
            const [key, val] = curr
            if (val.highlighted) shouldRerender = true
            acc[key] = { ...val, highlighted: false }
            return acc
          }, {} as StackedNotesState)

          if (!shouldRerender) return state

          return {
            ...state,
            stackedNotesState,
          }
        }),

      setHighlightedNote: (id: string) =>
        set((state) => {
          let shouldRerender = false
          const stackedNotesState = Object.entries(state.stackedNotesState).reduce((acc, curr) => {
            const [key, val] = curr
            acc[key] = { ...val, highlighted: key === id }
            if (key === id) shouldRerender = true
            return acc
          }, {} as StackedNotesState)

          if (!shouldRerender) return state

          return {
            ...state,
            stackedNotesState,
          }
        }),
      setNoteWidth: (width: number) => set((state) => ({ ...state, noteWidth: width })),
      scrollToEnd: (ref) => {
        if (!ref) return
        ref.current?.scrollTo({ left: ref.current?.scrollWidth, behavior: 'smooth' })
      },
      scrollToIndex: ({ ref, i, noteWidth }) => {
        if (!ref) return
        ref.current?.scrollTo({
          left: i * noteWidth,
          behavior: 'smooth',
        })
      },
      scrollToId: ({ ref, id, noteWidth, stackedNotesState }) => {
        if (!ref) return
        const index = Object.entries(stackedNotesState).find(([noteId]) => noteId === id)?.[1]
          ?.index
        if (!index) return

        ref.current?.scrollTo({
          left: index * noteWidth,
          behavior: 'smooth',
        })
      },
      removeNoteById: (id: string) =>
        set((state) => {
          const { [id]: dummy, ...rest } = state.stackedNotesState
          return { ...state, stackedNotesState: rest }
        }),
      setScrollContainer: (ref) => set((state) => ({ ...state, scrollContainer: ref })),
    }),
  ),
)

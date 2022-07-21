import { Stats } from 'fs'
import { ComponentType } from 'react'
/**
 * State of the current object in the stack
 */
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
  [title: string]: StackState
}

export interface FileList {
  [key: string]: {
    title: string
    name?: string
    folders: string[]
    path: string
    slug: string
  }
}

export interface File {
  path: string
  type: 'file'
  id: string
}
export interface Files {
  files: File[]
  folders: { [key: string]: File[] }
}
export interface NoteHeading {
  level: string
  text: string
  id: string
}

export type ReactObjectType = Partial<{
  [TagName in keyof JSX.IntrinsicElements]:
    | keyof JSX.IntrinsicElements
    | ComponentType<JSX.IntrinsicElements[TagName]>
}>
export type NextJSCompatibleStats = Omit<
  Stats,
  'mtime' | 'ctime' | 'atime' | 'birthtime' | `is${string}`
>
export interface DataBy {
  [slug: string]: {
    basename: string
    stats: NextJSCompatibleStats
    fullPath: string
    name: string
    folders: string[]
    path: string
    slug: string
    backlinks?: Backlink[]
  }
}

export interface Backlinks {
  [k: string]: Backlink[]
}
export interface Backlink {
  link: string
  sentences?: string[] | undefined
  slug: string
  name?: string | undefined
  // }
}

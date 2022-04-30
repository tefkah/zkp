import { NextJSCompatibleStats } from '.'

export interface Root {
  type: 'root'
  children: RecursiveFolder[]
  previouslySeenFolders: string[]
}

export interface RecursiveFolder {
  name: string
  type: 'folder'
  children: (RecursiveFolder | FileLeaf)[]
}

export interface FileLeaf {
  type: 'file'
  name: string
  slug: string
  stats: NextJSCompatibleStats
}

export type CompareFn = (a: RecursiveFolder | FileLeaf, b: RecursiveFolder | FileLeaf) => number

export type Sorts =
  | 'alpha'
  | 'reverseAlpha'
  | 'created'
  | 'reverseCreated'
  | 'modified'
  | 'reverseModified'

import { NextJSCompatibleStats } from '.'

export interface Root {
  type: 'root'
  children: RecursiveFolder[]
  previouslySeenFolders: string[]
}

export interface RecursiveFolder {
  name: string
  type: 'folder'
  slug?: string
  children: (RecursiveFolder | FileLeaf)[]
}

export const isFile = (fileOrFolder: RecursiveFolder | FileLeaf): fileOrFolder is FileLeaf =>
  Object.hasOwnProperty.call(fileOrFolder, 'stats')

export const isFolder = (
  fileOrFolder: RecursiveFolder | FileLeaf,
): fileOrFolder is RecursiveFolder => Object.hasOwnProperty.call(fileOrFolder, 'children')
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

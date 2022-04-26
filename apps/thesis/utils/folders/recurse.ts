import { convert } from 'unist-util-is'
import { FileLeaf, RecursiveFolder, FileList } from '../../types'

const isFile = convert<FileLeaf>('file')

export type CompareFn = (a: RecursiveFolder | FileLeaf, b: RecursiveFolder | FileLeaf) => number

export const defaultSort: CompareFn = (a, b) => {
  if (a.type === b.type) {
    return a.name.localeCompare(b.name)
  }

  return a.type === 'folder' ? -100 : 100
}

export const recursePath = (
  thing: RecursiveFolder,
  splitPath: (string | FileLeaf)[],
  compareFn?: CompareFn,
): RecursiveFolder => {
  if (!splitPath?.length) return thing

  if (splitPath?.length === 1 && typeof splitPath[0] !== 'string') {
    thing.children.push(splitPath[0])
    thing.children.sort(compareFn)
    return thing
  }

  const fold = splitPath.shift()

  const index = thing.children.findIndex((child) => !isFile(child) && child.name === fold)

  // There isn't already a folder with the correct name
  if (index < 0 && thing.name !== fold) {
    thing.children.push({ type: 'folder', name: fold as string, children: [] })
    const child = thing.children.at(-1) as RecursiveFolder

    const folder = recursePath(child, splitPath, compareFn)

    thing.children.sort(compareFn)
    //   folder.children.sort(compareFn)
    return folder
  }

  const folder = recursePath(thing.children[index] as RecursiveFolder, splitPath, compareFn)
  thing.children.sort(compareFn)
  // folder.children.sort(compareFn)
  return folder
}

export const fileListReducer = (files: FileList[string][], compareFn: CompareFn = defaultSort) =>
  files.reduce(
    (acc: RecursiveFolder, curr) => {
      const { folders, title, ...file } = curr

      const newFile = { ...file, type: 'file', ...(file.name ? {} : { name: title }) } as FileLeaf

      const foldersAndFile = [...folders, newFile]

      recursePath(acc, foldersAndFile, compareFn)

      acc.children.sort(compareFn)

      return acc
    },
    { type: 'folder', name: 'root', children: [] } as RecursiveFolder,
  )

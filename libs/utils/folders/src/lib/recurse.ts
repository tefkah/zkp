import { convert } from 'unist-util-is'
import { FileLeaf, RecursiveFolder, CompareFn, DataBy } from '@zkp/types'
import { defaultSort } from './sorts'

const isFile = convert<FileLeaf>('file')

export const recursePath = (
  thing: RecursiveFolder,
  splitPath: (string | FileLeaf)[],
  compareFn?: CompareFn,
  full = false,
): RecursiveFolder => {
  if (!splitPath?.length) return thing

  if (splitPath?.length === 1 && typeof splitPath[0] !== 'string') {
    const {
      // path,
      slug,
      name,
      type,
      stats: { mtimeMs, ctimeMs },
    } = splitPath[0]
    const leaf = full
      ? splitPath[0]
      : ({ type, name, slug, stats: { mtimeMs, ctimeMs } } as FileLeaf)

    thing.children.push(leaf)
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

export const fileListReducer = (
  files: DataBy[string][],
  compareFn: CompareFn = defaultSort,
  full = false,
) =>
  files.reduce(
    (acc: RecursiveFolder, curr) => {
      const { folders, name, stats, ...file } = curr

      const newFile = { ...file, type: 'file', name, stats } as FileLeaf

      const foldersAndFile = [...folders, newFile]

      recursePath(acc, foldersAndFile, compareFn, full)

      acc.children.sort(compareFn)

      return acc
    },
    { type: 'folder', name: 'root', children: [] } as RecursiveFolder,
  )

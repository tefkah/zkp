// @ts-nocheck
import merge from 'lodash/merge'
import { convert } from 'unist-util-is'
import { FileList } from '../../types'

const isFile = convert('file')

const findFolderIndex = (children: RecursiveFolder[], name: string): number =>
  children.findIndex((child) => child.name === name)

export const recursiveFolderReducer = (
  recursiveFolder: RecursiveFolder,
  folders: (string | FileLeaf)[],
  index: string[],
): (RecursiveFolder | string)[] => {
  const folderOrFile = folders?.shift()

  if (!folderOrFile) return [recursiveFolder]

  if (isFile(folderOrFile)) {
    const folderIndex = findFolderIndex(recursiveFolder, folderOrFile.name)
    recursiveFolder[folderIndex].children.push(folderOrFile)
    return recursiveFolder
  }

  if (recursiveFolder.previouslySeenFolders.includes(folderOrFile)) {
  }

  merge(recursiveFolder.previouslySeenFolders, folders.slice(-1))
  // make sure to add children so we don't need to check for that the whole time

  // At a leaf
  //
  //
}

export const createFoldersFromFileList = (fileList: FileList) => {
  // first create the folder structure

  const indexed = Object.values(fileList).reduce(
    (acc, curr) => {
      const { folders } = curr

      const concatFolders = folders.join('/')

      if (!concatFolders) {
        acc?.root.push(curr)
        return acc
      }
      acc[concatFolders].push(curr)

      return acc
      return acc
    },
    { root: [] } as { [key: string]: FileList[string][] },
  )

  const paths = Object.keys(indexed)

  return res
}

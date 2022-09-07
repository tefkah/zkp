import { FileLeaf, RecursiveFolder } from '@zkp/types'

export const getName = (leaf: RecursiveFolder | FileLeaf) => {
  return leaf.name
}

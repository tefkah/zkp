// yoinked from
// https://github.com/kpj/GitViz/blob/83dfc65624f5dae41ffb9e8a97d2ee61512c1365/src/git-handler.js#L61

import { TREE, walk, WalkerEntry } from 'isomorphic-git'
import fs from 'fs'

const modObj = (file: string, mod: string) => ({
  file,
  type: mod,
})

export type FileStates = 'equal' | 'modified' | 'add' | 'remove'
// same as the other but from the isomorphic-git docs
export async function doSomethingAtFileStateChange(
  commitHash1: string,
  commitHash2: string,
  dir: string = 'notes',
  gitdir: string = 'notes/git',
  fileStateFun?: (
    filepath: string,
    trees: Array<WalkerEntry | null>,
    state: FileStates,
  ) => Promise<{ [key: string]: any } | undefined>,
) {
  return walk({
    fs,
    dir,
    gitdir,
    trees: [TREE({ ref: commitHash1 }), TREE({ ref: commitHash2 })],
    map: async function (filepath, [A, B]) {
      // ignore directories
      if (filepath === '.') {
        return
      }
      if ((await A?.type()) === 'tree' || (await B?.type()) === 'tree') {
        return
      }

      // generate ids
      const Aoid = await A?.oid()
      const Boid = await B?.oid()

      // determine modification type
      let type = 'equal'
      if (Aoid !== Boid) {
        type = 'modify'
      }
      if (Aoid === undefined) {
        type = 'add'
      }
      if (Boid === undefined) {
        type = 'remove'
      }
      if (Aoid === undefined && Boid === undefined) {
        console.log('Something weird happened:')
        console.log(A)
        console.log(B)
      }

      if (fileStateFun) {
        return await fileStateFun(filepath, [A, B], type as FileStates)
      }
      return {
        path: `/${filepath}`,
        type: type,
      }
    },
  })
}

export async function getFileStateChanges(
  commitHash1: string,
  commitHash2: string,
  dir: string = 'notes',
  gitdir: string = 'notes/git',
  fileStateFun?: (
    filepath: string,
    trees: Array<WalkerEntry | null>,
    state: FileStates,
  ) => Promise<{ [key: string]: any } | undefined>,
) {
  return doSomethingAtFileStateChange(commitHash1, commitHash2, dir, gitdir, fileStateFun)
}

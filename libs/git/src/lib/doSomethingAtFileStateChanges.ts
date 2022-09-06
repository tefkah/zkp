import git, { TREE, walk, WalkerEntry } from 'isomorphic-git'
import fs from 'fs'
import { NEXT_PUBLIC_NOTE_DIR, GIT_DIR } from '@zkp/paths'
import { FileStates } from '@zkp/types'

export const doSomethingAtFileStateChange = ({
  commitHash1,
  commitHash2 = 'HEAD',
  dir = NEXT_PUBLIC_NOTE_DIR,
  gitdir = GIT_DIR,
  filename,
  fileStateFun,
}: {
  commitHash1: string
  commitHash2?: string
  dir?: string
  gitdir?: string
  filename?: string
  fileStateFun?: (
    filepath: string,
    trees: [WalkerEntry, WalkerEntry],
    state: FileStates,
  ) => Promise<{ [key: string]: any } | undefined>
}) =>
  walk({
    fs,
    dir,
    gitdir,
    trees: [TREE({ ref: commitHash1 }), TREE({ ref: commitHash2 })],
    map: async (filepath, [A, B]) => {
      // ignore directories
      if (filepath === '.') {
        return
      }

      if (filename) {
        if (filename.length > 5 && !new RegExp(filename, 'i').test(filepath)) {
          return
        }
        if (filename.length <= 5 && filepath !== filename) {
          return
        }

        console.log(filename, filepath)
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
        return fileStateFun(filepath, [A, B], type as FileStates)
      }
      return {
        path: `/${filepath}`,
        type,
      }
    },
  })

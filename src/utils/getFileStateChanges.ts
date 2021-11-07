// yoinked from
// https://github.com/kpj/GitViz/blob/83dfc65624f5dae41ffb9e8a97d2ee61512c1365/src/git-handler.js#L61

import { TREE, walk } from 'isomorphic-git'
import fs from 'fs'

export default async function getFileStateChanges(
  commitHash1: string,
  commitHash2: string,
  dir: string = '.',
  gitdir: string = `${dir}/.git`,
) {
  return walk({
    fs,
    dir,
    gitdir,
    trees: [TREE({ ref: commitHash1 }), TREE({ ref: commitHash2 })],
    map: async (file, [A, B]) => {
      // ignore directories
      if (file === '.') {
        return
      }
      if (!A || !B) {
        return
      }
      if ((await A.type()) === 'tree') {
        return
      }
      if ((await B.type()) === 'tree') {
        return
      }

      // generate ids
      const aId = await A.oid()
      const bId = await B.oid()

      console.log(aId)
      console.log(bId)
      // determine modification type
      let type = 'equal'
      if (aId !== bId) {
        type = 'modify'
      }
      if (aId === undefined) {
        type = 'add'
      }
      if (aId === undefined) {
        type = 'remove'
      }
      if (aId === undefined && bId === undefined) {
        console.log('Something weird happened:')
        console.log(A)
        console.log(B)
      }

      return {
        path: `/${file}`,
        type: type,
      }
    },
  })
}

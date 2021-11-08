// yoinked from
// https://github.com/kpj/GitViz/blob/83dfc65624f5dae41ffb9e8a97d2ee61512c1365/src/git-handler.js#L61

import { TREE, walk, WalkerEntry } from 'isomorphic-git'
import fs from 'fs'
import * as Diff from 'diff'

async function diffMap(filepath: string, trees: Array<WalkerEntry | null>) {
  const [tree1, tree2] = trees
  if (!tree1 || !tree2) {
    return
  }
  if ((await tree1.type()) === 'tree' || (await tree2.type()) === 'tree') {
    return
  }
  const t1Content = (await tree1.content())!
  const t2Content = (await tree2.content())!
  const t1Buffer = Buffer.from(t1Content)
  const t2Buffer = Buffer.from(t2Content)
  const t1String = t1Buffer.toString('utf8')
  const t2String = t2Buffer.toString('utf8')

  //  console.log(t1String)
  return {
    filepath,
    oid: await tree1.oid(),
    diff: Diff.diffWords(t1String, t2String),
  }
}

const modObj = (file: string, mod: string) => ({
  file,
  type: mod,
})
export async function getFileStateChangesDoc(
  commitHash1: string,
  commitHash2: string,
  dir: string = 'notes',
  gitdir: string = 'notes/git',
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

      return {
        path: `/${filepath}`,
        type: type,
      }
    },
  })
}

async function fileChangeMap(file: string, [A, B]: Array<WalkerEntry | null>) {
  // ignore directories
  let log = false
  if (file.includes('yml')) {
    log = true
  }
  if (file === '.') {
    return
  }

  if (!A && !B) {
    console.log('not sure what this is')
    return
  }
  if (!A && B) {
    return modObj(file, 'add')
  }
  if (A && !B) {
    return modObj(file, 'remove')
  }
  if (!A || !B) {
    console.log('you shouldnt see this')
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

  // determine modification type
  let type = 'equal'
  if (aId !== bId) {
    type = 'modify'
  }
  if (aId === undefined) {
    type = 'add'
  }
  if (bId === undefined) {
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
}

export async function getFileStateChanges(
  commitHash1: string,
  commitHash2: string,
  dir: string = '.',
  gitdir: string = `${dir}/git`,
) {
  return walk({
    fs,
    dir,
    gitdir,
    trees: [TREE({ ref: commitHash1 }), TREE({ ref: commitHash2 })],
    map: fileChangeMap,
  })
}

export async function getCommitDiff(
  commitHash1: string,
  commitHash2: string,
  dir: string = '.',
  gitdir: string = `${dir}/git`,
) {
  return walk({
    fs,
    dir,
    gitdir,
    trees: [TREE({ ref: commitHash1 }), TREE({ ref: commitHash2 })],
    map: diffMap,
  })
}

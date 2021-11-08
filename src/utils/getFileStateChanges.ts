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
  //console.log(t1String)
  return {
    filepath,
    oid: await tree1.oid(),
    diff: Diff.diffWords(t1String, t2String),
  }
}

async function fileChangeMap(file: string, [A, B]: Array<WalkerEntry>) {
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
}

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
    map: diffMap,
  })
}

import { TREE, walk, WalkerEntry } from 'isomorphic-git'
import fs from 'fs'
import * as Diff from 'diff'
import { doSomethingAtFileStateChange } from './getFileStateChanges'
import { Change } from 'diff'

export type FileDiff =
  | {
      filepath: string
      oid: string
      diff: Change[]
      counts: { [key: string]: number }
    }
  | undefined

async function diffMap(
  filepath: string,
  trees: Array<WalkerEntry | null>,
  type?: string,
): Promise<FileDiff> {
  if (type === 'equal') {
    return
  }
  const [tree1, tree2] = trees
  //  if (!tree1 || !tree2) {
  //    return
  //  }
  if ((await tree1?.type()) === 'tree' || (await tree2?.type()) === 'tree') {
    return
  }
  const t1Content = (await tree1?.content()) || []
  const t2Content = (await tree2?.content()) || []
  const t1Buffer = Buffer.from(t1Content)
  const t2Buffer = Buffer.from(t2Content)
  const t1String = t1Buffer.toString('utf8')
  const t2String = t2Buffer.toString('utf8')

  //  console.log(t1String)
  const diff = Diff.diffWordsWithSpace(t1String, t2String)
  const counts = diff.reduce<{ [key: string]: number }>(
    (acc: { [key: string]: number }, curr: Change): { [key: string]: number } => {
      if (curr.added) {
        acc.additions = acc.additions + curr.value.split(' ').length
      }
      if (curr.removed) {
        acc.deletions = acc.deletions + curr.value.split(' ').length
      }
      return acc
    },
    { additions: 0, deletions: 0 },
  )
  return {
    filepath,
    oid: (await tree1?.oid()) || (await tree2?.oid()) || '',
    diff,
    counts,
  }
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

export async function getModifiedCommitDiff(
  commitHash1: string,
  commitHash2: string,
  dir: string = '.',
  gitdir: string = `${dir}/git`,
) {
  return await doSomethingAtFileStateChange(commitHash1, commitHash2, dir, gitdir, diffMap)
}

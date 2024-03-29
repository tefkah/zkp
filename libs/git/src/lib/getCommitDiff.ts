/* eslint-disable consistent-return */
import { TREE, walk, WalkerEntry } from 'isomorphic-git'
import fs from 'fs'
import * as Diff from 'diff'
import { Change } from 'diff'
import { extname } from 'path'
import { FileDiff } from '@zkp/types'
import { GIT_DIR, NEXT_PUBLIC_NOTE_DIR } from '@zkp/paths'

const bufferToString = async (tree: WalkerEntry) => {
  const content = (await tree?.content()) || []
  return content.length ? Buffer.from(content).toString('utf8') : ''
}

export interface DiffMapProps {
  filepath: string
  trees: Array<WalkerEntry | null>
  type?: string
  justStats?: boolean
}

const diffMap = async (props: DiffMapProps): Promise<FileDiff | void> => {
  const { filepath, trees, type, justStats } = props
  const [tree1, tree2] = trees

  // console.log(props)
  if (type === 'equal') {
    return
  }

  // ignore dirs
  if (filepath === '.') {
    return
  }

  // just show .org diffs
  // TODO make this an env var
  if (!process.env.INCLUDED_EXTENSIONS?.includes(extname(filepath))) {
    return
  }

  if ((await tree1?.type()) === 'tree' || (await tree2?.type()) === 'tree') {
    return
  }

  // ignore unmodified files
  if ((await tree1?.oid()) === (await tree2?.oid())) return

  if (!tree1 || !tree2) {
    // TODO count the words
    const added = tree2 ? true : undefined
    const impTree = tree2 || tree1
    const string = await bufferToString(impTree!)
    const count = string.split(' ').length

    return {
      filepath,
      oid: (await tree1?.oid()) || (await tree2?.oid()) || '',
      diff: justStats
        ? []
        : [
            {
              count,
              value: string,
              added,
              removed: !added,
            },
          ],
      additions: added ? count : 0,
      deletions: !added ? count : 0,
    }
  }

  // We don't want to do all the expensive diffing
  // if the files are just added or removed.
  const treeStrings: string[] = []
  // eslint-disable-next-line no-restricted-syntax
  for (const tree of trees) {
    // eslint-disable-next-line no-await-in-loop
    const string = await bufferToString(tree!)
    treeStrings.push(string)
  }

  const [t1String, t2String] = treeStrings
  //  console.log(t1String)
  const diff = Diff.diffWordsWithSpace(t1String, t2String)
  // get total additions for filecommit
  const { additions, deletions } = diff.reduce<{ [key: string]: number }>(
    (acc: { [key: string]: number }, curr: Change): { [key: string]: number } => {
      if (curr.added) {
        acc.additions += curr.value.split(' ').length
      }
      if (curr.removed) {
        acc.deletions += curr.value.split(' ').length
      }
      return acc
    },
    { additions: 0, deletions: 0 },
  )

  // and get rid of undefined props as Next doesnit like it
  // TODO maybe optimize this to one loop, but prolly not a big deal
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const cleanDiff = diff.map((curr) => {
    if (curr.removed === undefined) {
      return { ...curr, removed: false }
    }
    if (curr.added === undefined) {
      return { ...curr, added: false }
    }
    return curr
  })

  return {
    filepath,
    oid: (await tree1?.oid()) || (await tree2?.oid()) || '',
    diff: justStats ? [] : diff,
    additions,
    deletions,
  }
}

export const getCommitDiff = async (
  commitHash1: string,
  commitHash2: string,
  dir = NEXT_PUBLIC_NOTE_DIR,
  gitdir = GIT_DIR,
  justStats?: boolean,
) =>
  walk({
    fs,
    dir,
    gitdir,
    trees: [TREE({ ref: commitHash1 }), TREE({ ref: commitHash2 })],
    map: (filename: string, trees: Array<WalkerEntry | null>) =>
      diffMap({ filepath: filename, trees, justStats }),
  })

/**
 * TODO: Change parameters to take an object jfc
 */
export const getCommitDiffForSingleFile = async (
  commitHash1: string,
  commitHash2: string,
  dir = NEXT_PUBLIC_NOTE_DIR,
  gitdir = GIT_DIR,
  file?: string,
  justStats?: boolean,
) =>
  // console.log(gitdir)
  walk({
    fs,
    dir,
    gitdir,
    trees: [TREE({ ref: commitHash1 }), TREE({ ref: commitHash2 })],
    map: (filename: string, trees: Array<WalkerEntry | null>) => {
      if (file && filename !== file)
        return new Promise((resolve) => {
          resolve(undefined)
        })
      return diffMap({ filepath: filename, trees, justStats })
    },
  })

// export async function getModifiedCommitDiff(
//   commitHash1: string,
//   commitHash2: string,
//   dir: string = 'notes',
//   gitdir: string = `${dir}/git`,
// ): Promise<FileDiff> {
//   return await doSomethingAtFileStateChange(commitHash1, commitHash2, dir, gitdir, diffMap)
// }

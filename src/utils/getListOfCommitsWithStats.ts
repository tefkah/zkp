import { FileDiff, getCommitDiff, getModifiedCommitDiff } from './getCommitDiff'
import { commit, log } from 'isomorphic-git'
import fs, { access } from 'fs'
import { doSomethingAtFileStateChange, getFileStateChanges } from './getFileStateChanges'
import { join } from 'path'

export interface Commit {
  message: string
  date: number
  files: File[]
  additions: number
  deletions: number
  oid: string
}

export interface File {
  filepath: string
  oid: string
  diff: any[]
  additions: number
  deletions: number
}

export async function getListOfCommitsWithStats(
  commit1: string,
  commit2: string,
  dir: string = 'notes',
  gitdir: string = 'notes/git',
) {
  console.log('hhhhhhh')
  const commitList = await log({ fs, dir, gitdir })
  commitList.reverse()
  const commitIndexList = commitList.map((commit) => commit.oid)

  const cwd = process.cwd()
  const gitJS = join(cwd, 'data', 'git.json')
  const gitObj = JSON.parse(fs.readFileSync(gitJS, { encoding: 'utf8' }))
  const lastWrittenCommit = gitObj[gitObj.length - 1].oid
  const commitIndex = commitIndexList.indexOf(lastWrittenCommit) + 1

  let data = gitObj

  for (let i = commitIndex + 1; i < commitList.length - 1; i++) {
    const curCommit = commitList[i]
    const nextCommit = commitList[i + 1]

    const files: FileDiff[] = await getCommitDiff(curCommit.oid, nextCommit.oid, dir, gitdir)
    const { additions, deletions } = files.reduce(
      (acc: { [key: string]: number }, curr: FileDiff) => {
        if (!curr) return acc
        acc.additions += curr?.additions
        acc.deletions += curr?.deletions
        return acc
      },
      { additions: 0, deletions: 0 },
    )

    data.push({
      oid: nextCommit.oid,
      message: nextCommit.commit.message,
      date: nextCommit.commit.author.timestamp,
      files: files,
      additions,
      deletions,
    })
  }
  fs.writeFileSync(gitJS, JSON.stringify(data))
  return data
}

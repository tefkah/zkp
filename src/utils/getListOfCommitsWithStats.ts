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

const consolidateCommitsPerDay = (data: any) => {
  return data.reduce((acc: any, curr: Commit) => {
    const commitDate = new Date(curr.date * 1000).toISOString().slice(0, 10)

    return {
      ...acc,
      [commitDate]: {
        totalAdditions: (acc?.[commitDate]?.additions || 0) + curr.additions,
        totalDeletions: (acc?.[commitDate]?.deletions || 0) + curr.deletions,
        totalDate: curr.date,
        lastMessage: curr.message,
        lastOid: curr.oid,
        commits: [...(acc?.[commitDate]?.commits || []), curr],
      },
    }
  }, {})
}

const tryParse = (path: string, fallback?: any[]) => {
  try {
    return JSON.parse(fs.readFileSync(path, { encoding: 'utf8' }))
  } catch (e) {
    console.log(e)
    console.log('Using new obj')
    return fallback || []
  }
}

export async function getListOfCommitsWithStats(
  commit1: string,
  commit2: string,
  dir: string = 'notes',
  gitdir: string = 'notes/git',
) {
  const commitList = await log({ fs, dir, gitdir })
  commitList.reverse()
  const commitIndexList = commitList.map((commit) => commit.oid)

  const cwd = process.cwd()

  const gitJS = join(cwd, 'data', 'git.json')
  const gitSlimJS = join(cwd, 'data', 'gitSlim.json')
  const gitPerDateJS = join(cwd, 'data', 'gitPerDate.json')

  const gitObj = tryParse(gitJS)
  const gitSlimObj = tryParse(gitSlimJS)

  const lastWrittenCommit = gitObj[gitObj.length - 1]?.oid || ''
  const commitIndex = commitIndexList.indexOf(lastWrittenCommit) + 1

  if (gitObj.length && commitIndex === gitObj.length) {
    const gitPerDateTest = tryParse(gitPerDateJS)
    const gitPerDateObj = gitPerDateTest.length
      ? gitPerDateTest
      : consolidateCommitsPerDay(gitSlimObj)

    console.log('No new changes since last build.')
    return { data: gitObj, dataWithoutDiffs: gitSlimObj, dataPerDate: gitPerDateObj }
  }

  let data = gitObj
  let dataWithoutDiffs = gitSlimObj

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

    const fullData = {
      oid: nextCommit.oid,
      message: nextCommit.commit.message,
      date: nextCommit.commit.author.timestamp,
      files: files,
      additions,
      deletions,
    }

    const compData = {
      oid: fullData.oid,
      message: fullData.message,
      date: fullData.date,
      additions: additions,
      deletions,
      files: [],
    }

    data.push(fullData)
    dataWithoutDiffs.push(compData)
  }

  const gitPerDate = consolidateCommitsPerDay(dataWithoutDiffs)

  fs.writeFileSync(gitJS, JSON.stringify(data))
  fs.writeFileSync(gitSlimJS, JSON.stringify(dataWithoutDiffs))
  fs.writeFileSync(gitPerDateJS, JSON.stringify(gitPerDate))

  return { data, dataWithoutDiffs, dataPerDate: gitPerDate }
}

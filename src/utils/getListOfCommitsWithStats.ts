import { getCommitDiff } from './getCommitDiff'
import { commit, log } from 'isomorphic-git'
import fs, { access } from 'fs'
import { doSomethingAtFileStateChange, getFileStateChanges } from './getFileStateChanges'
import { join } from 'path'
import { FileDiff, Commit } from '../api'

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

export const tryReadJSON = async (path: string, fallback?: any[]) => {
  const cwdPath = join(process.cwd(), path)
  try {
    return JSON.parse(await fs.promises.readFile(cwdPath, { encoding: 'utf8' }))
  } catch (e) {
    console.log(e)
    console.log('Using new obj')
    return fallback || []
  }
}

export const getCommits = async (dir: string = 'notes', gitdir: string = 'notes/git') => {
  const commitList = (await log({ fs, dir, gitdir })).reverse()
  return commitList
}

export async function getListOfCommitsWithStats(
  commit1: string,
  commit2: string,
  dir: string = 'notes',
  gitdir: string = 'notes/git',
) {
  const gitJS = join('data', 'git.json')
  const gitSlimJS = join('data', 'gitSlim.json')
  const gitFilesJS = join('data', 'gitFiles.json')
  const gitPerDateJS = join('data', 'gitPerDate.json')

  const gitObj = await tryReadJSON(gitJS)
  const gitFilesObj = await tryReadJSON(gitFilesJS)
  const gitSlimObj = await tryReadJSON(gitSlimJS)

  const lastWrittenCommit = gitObj[gitObj.length - 1]?.oid || ''

  const commitList = await getCommits()
  const commitIndexList = commitList.map((commit) => commit.oid)
  const commitIndex = commitIndexList.indexOf(lastWrittenCommit) + 1

  if (gitObj.length && commitIndex === gitObj.length) {
    const gitPerDateTest = await tryReadJSON(gitPerDateJS)
    const gitPerDateObj = gitPerDateTest.length
      ? gitPerDateTest
      : consolidateCommitsPerDay(gitSlimObj)

    console.log('No new changes since last build.')
    return {
      data: gitObj,
      dataWithoutDiffs: gitSlimObj,
      dataPerDate: gitPerDateObj,
      dataWithJustOidAndFiles: gitFilesObj,
    }
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
  type Commit = { oid: string; files: string[] }
  const gitFiles = data.map((d: any) => ({
    oid: d.oid,
    files: d.files.map((f: any) => f.filepath),
  }))

  await fs.promises.writeFile(gitJS, JSON.stringify(data))
  await fs.promises.writeFile(gitSlimJS, JSON.stringify(dataWithoutDiffs))
  await fs.promises.writeFile(gitFilesJS, JSON.stringify(gitFiles))
  await fs.promises.writeFile(gitPerDateJS, JSON.stringify(gitPerDate))

  return { data, dataWithoutDiffs, dataPerDate: gitPerDate, dataWithJustOidAndFiles: gitFiles }
}

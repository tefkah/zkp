import { log } from 'isomorphic-git'
import fs from 'fs'
import { join, resolve } from 'path'
import { getCommitDiff } from './getCommitDiff'
import { Commit, FileDiff, SlimCommit } from '@zkp/types'
import { DATA_DIR, GIT_DIR, NEXT_PUBLIC_NOTE_DIR } from '@zkp/paths'

export const consolidateCommitsPerDay = (data: SlimCommit[]) =>
  data.reduce((acc: any, curr: Commit) => {
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

export const tryReadJSON = async (path: string, fallback?: any[]) => {
  const cwdPath = resolve(process.cwd(), path)
  try {
    return JSON.parse(await fs.promises.readFile(cwdPath, { encoding: 'utf8' }))
  } catch (e) {
    console.log(e)
    console.log('Using new obj')
    return fallback || []
  }
}
export const getCommits = async (dir = NEXT_PUBLIC_NOTE_DIR, gitdir = GIT_DIR) => {
  console.log(`getCommits: dir = ${dir}`)
  console.log(`getCommits: gitdir = ${gitdir}`)
  const commitList = (await log({ fs, dir, gitdir })).reverse()
  return commitList
}
export const getListOfCommitsWithStats = async (
  commit1?: string,
  commit2?: string,
  dir = NEXT_PUBLIC_NOTE_DIR,
  gitdir = GIT_DIR,
  datadir = DATA_DIR,
) => {
  //  const cwd = process.cwd()

  if (!fs.existsSync(datadir)) await fs.promises.mkdir(datadir)

  const gitJS = join(datadir, 'git.json')
  const gitSlimJS = join(datadir, 'gitSlim.json')
  const gitPerDateJS = join(datadir, 'gitPerDate.json')

  const gitObj = await tryReadJSON(gitJS)
  const gitSlimObj = await tryReadJSON(gitSlimJS)

  const lastWrittenCommit = gitObj?.[gitObj.length - 1]?.oid || ''

  const commitList = await getCommits(dir, gitdir)
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
    }
  }
  const data = gitObj
  const dataWithoutDiffs = gitSlimObj
  // eslint-disable-next-line no-plusplus
  for (let i = commitIndex + 1; i < commitList.length - 1; i++) {
    const curCommit = commitList[i]
    const nextCommit = commitList[i + 1]
    // eslint-disable-next-line no-await-in-loop
    const files = await getCommitDiff(curCommit.oid, nextCommit.oid, dir, gitdir)
    const { additions, deletions } = files.reduce(
      (acc: { [key: string]: number }, curr: FileDiff) => {
        if (!curr) return acc
        acc.additions += curr?.additions ?? 0
        acc.deletions += curr?.deletions ?? 0
        return acc
      },
      { additions: 0, deletions: 0 },
    )
    const fullData = {
      oid: nextCommit.oid,
      message: nextCommit.commit.message,
      date: nextCommit.commit.author.timestamp,
      files,
      additions,
      deletions,
    }
    const slimData = {
      oid: fullData.oid,
      message: fullData.message,
      date: fullData.date,
      additions,
      deletions,
      files: files.map((f: any) => f.filepath),
    }
    data.push(fullData)
    dataWithoutDiffs.push(slimData)
  }
  const gitPerDate = consolidateCommitsPerDay(dataWithoutDiffs)
  await fs.promises.writeFile(gitJS, JSON.stringify(data))
  await fs.promises.writeFile(gitSlimJS, JSON.stringify(dataWithoutDiffs))
  await fs.promises.writeFile(gitPerDateJS, JSON.stringify(gitPerDate))
  return { data, dataWithoutDiffs, dataPerDate: gitPerDate }
}

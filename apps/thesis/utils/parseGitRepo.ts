import fs from 'fs'
import { log } from 'isomorphic-git'
import { getFileStateChanges } from './getFileStateChanges'

export const parseGitRepo = async (repoUrl: string, dir: string, gitdir: string) => {
  // prepare filesystem

  // get data from repo
  const commitList = await log({ fs, dir, gitdir })
  commitList.reverse()

  const data = []

  for (let i = 0; i < commitList.length - 1; i++) {
    const curCommit = commitList[i]
    const nextCommit = commitList[i + 1]

    const files = await getFileStateChanges(curCommit.oid, nextCommit.oid, dir, gitdir)

    data.push({
      commit: nextCommit,
      files,
    })
  }

  return data
}

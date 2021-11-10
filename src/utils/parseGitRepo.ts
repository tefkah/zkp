import fs from 'fs'
import http from 'isomorphic-git/http/node'
import { clone, log, listFiles } from 'isomorphic-git'
import { getFileStateChanges } from './getFileStateChanges'
import path from 'path'

export default async function parseGitRepository(repoUrl: string, dir: string, gitdir: string) {
  // prepare filesystem

  // get data from repo
  const commitList = await log({ fs, dir, gitdir })
  commitList.reverse()

  let data = []

  for (let i = 0; i < commitList.length - 1; i++) {
    let curCommit = commitList[i]
    let nextCommit = commitList[i + 1]

    const files = await getFileStateChanges(curCommit.oid, nextCommit.oid, dir, gitdir)

    data.push({
      commit: nextCommit,
      files,
    })
  }

  return data
}

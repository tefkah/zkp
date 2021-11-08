import fs from 'fs'
import http from 'isomorphic-git/http/node'
import { clone, log, listFiles } from 'isomorphic-git'
import { getFileStateChanges } from './getFileStateChanges'
import path from 'path'

export default async function parseGitRepository(repoUrl: string, dir: string, gitdir: string) {
  // prepare filesystem

  const pfs = fs.promises
  if (!fs.existsSync(dir)) {
    // prepare repo directory
    await pfs.mkdir(dir)

    // clone repo
    console.log('Clone repository')

    await clone({
      fs,
      http,
      dir,
      gitdir,
      corsProxy: 'https://cors.isomorphic-git.org',
      url: repoUrl,
      singleBranch: true,
      noCheckout: false,
    })
  }

  // get data from repo
  console.log('Parse commits')
  const commitList = await log({ fs, dir, gitdir })
  commitList.reverse()

  let data = []

  let firstCommit = commitList[0]
  /*   data.push({
    commit: firstCommit,
    files: await listFiles({ fs, dir: dir, ref: firstCommit.oid }).then((data) => {
      return data.map((e) => ({
        path: `/${e}`,
        type: 'equal',
      }))
    }),
  }) */

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

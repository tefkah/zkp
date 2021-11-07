import fs from 'fs'
import http from 'isomorphic-git/http/node'
import { clone, log, listFiles } from 'isomorphic-git'
import getFileStateChanges from './getFileStateChanges'

export default async function parseGitRepository(repoUrl: string, dir: string) {
  // prepare filesystem

  const pfs = fs.promises

  // prepare repo directory
  await pfs.mkdir(dir)

  // clone repo
  console.log('Clone repository')

  await clone({
    fs,
    http,
    dir,
    corsProxy: 'https://cors.isomorphic-git.org',
    url: repoUrl,
    singleBranch: true,
    noCheckout: false,
  })

  // get data from repo
  console.log('Parse commits')
  const commitList = await log({ fs, dir })
  commitList.reverse()

  let data = []

  let firstCommit = commitList[0]
  data.push({
    commit: firstCommit,
    files: await listFiles({ fs, dir: dir, ref: firstCommit.oid }).then((data) => {
      return data.map((e) => ({
        path: `/${e}`,
        type: 'equal',
      }))
    }),
  })

  for (let i = 0; i < commitList.length - 1; i++) {
    let curCommit = commitList[i]
    let nextCommit = commitList[i + 1]

    const files = await getFileStateChanges(curCommit.oid, nextCommit.oid, dir)

    data.push({
      commit: nextCommit,
      files,
    })
  }

  return data
}

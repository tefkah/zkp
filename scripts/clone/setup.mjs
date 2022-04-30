import { clone } from 'isomorphic-git'
import fs from 'fs'
import { join } from 'path'
import { getListOfCommitsWithStats } from './getListOfCommitsWithStats.mjs'
import { getFilesData } from './getFilesData.mjs'
import * as http from 'isomorphic-git/http/node/index.js'

const args = process.argv
const setup = async ({ remote, appdir, gitdir, notedir, datadir }) => {
  if (!remote) {
    console.error('Please first specify a remote for your notes in the options!')
    return
  }
  const cwd = process.cwd()
  const appDir = join(cwd, appdir)
  const noteDir = join(appDir, notedir)
  const gitDir = join(noteDir, gitdir)
  const dataDir = join(appDir, datadir)

  const firstCommit = '8a8d96b1a6ae75dd17f7462c31695823189f6f14'
  const lastCommit = '635c1974031c9ba51e275c308ac38617bd8b5b46'
  await clone({
    fs,
    http,
    url: 'https://github.com/thomasfkjorna/thesis-writing',
    dir: noteDir,
    gitdir: gitDir,
    remote: 'notes',
  })
  await getListOfCommitsWithStats(firstCommit, lastCommit, noteDir, gitDir, dataDir)
  // const dataById = await getFilesData('id', noteDir)
  // const dataByTitle = await getFilesData('title', noteDir)
  // const dataByCite = await getFilesData('cite', noteDir)
  // await fs.promises.writeFile(join(dataDir, 'dataById.json'), JSON.stringify(dataById))
  // await fs.promises.writeFile(join(dataDir, 'dataByTitle.json'), JSON.stringify(dataByTitle))
  // await fs.promises.writeFile(join(dataDir, 'dataByCite.json'), JSON.stringify(dataByCite))
}
//setup(readArgs)

setup({
  remote: args?.[2] ?? '',
  appdir: args?.[3] ?? 'apps/thesis',
  gitdir: args?.[4] ?? 'git',
  notedir: args?.[5] ?? 'notes',
  datadir: args?.[6] ?? 'data',
})

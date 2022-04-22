import { clone } from 'isomorphic-git'
import fs from 'fs'
import * as http from 'isomorphic-git/http/node'
import { join } from 'path'
import { getListOfCommitsWithStats } from '../src/utils/getListOfCommitsWithStats'
import getFilesData from '../src/utils/IDIndex/getFilesData'
;(async () => {
  const cwd = process.cwd()
  const noteDir = join(cwd, 'notes')
  const noteGitDir = join(cwd, 'notes', 'git')

  const firstCommit = '8a8d96b1a6ae75dd17f7462c31695823189f6f14'
  const lastCommit = '635c1974031c9ba51e275c308ac38617bd8b5b46'

  await clone({
    fs,
    http,
    url: 'https://github.com/thomasfkjorna/thesis-writing',
    dir: noteDir,
    gitdir: noteGitDir,
    remote: 'notes',
  })

  await getListOfCommitsWithStats(firstCommit, lastCommit, noteDir, noteGitDir)

  const dataById = await getFilesData('id')
  const dataByTitle = await getFilesData('title')
  const dataByCite = await getFilesData('cite')
  await fs.promises.writeFile(join(cwd, 'data', 'dataById.json'), JSON.stringify(dataById))
  await fs.promises.writeFile(join(cwd, 'data', 'dataByTitle.json'), JSON.stringify(dataByTitle))
  await fs.promises.writeFile(join(cwd, 'data', 'dataByCite.json'), JSON.stringify(dataByCite))
})()

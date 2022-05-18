import { clone } from 'isomorphic-git'

import fs from 'fs'

import { join } from 'path'
import * as http from 'isomorphic-git/http/node/index'
import { getFilesData } from '../utils/IDIndex/getFilesData'
import { getListOfCommitsWithStats } from '../utils/getListOfCommitsWithStats'

export const setup = async ({
  remote = '',
  appDir = 'apps/thesis',
  gitDir = 'git',
  noteDir = 'notes',
}: {
  remote: string
  appDir?: string
  gitDir?: string
  noteDir?: string
}) => {
  if (!remote) {
    console.error('Please first specify a remote for your notes in the options!')
    return
  }

  const cwd = process.cwd()
  const notesDir = join(cwd, appDir, noteDir)
  const noteGitDir = join(notesDir, gitDir)

  const firstCommit = '8a8d96b1a6ae75dd17f7462c31695823189f6f14'
  const lastCommit = '635c1974031c9ba51e275c308ac38617bd8b5b46'

  await clone({
    fs,
    http,
    url: remote,
    dir: notesDir,
    gitdir: noteGitDir,
    remote: 'notes',
  })

  await getListOfCommitsWithStats(firstCommit, lastCommit, notesDir, noteGitDir)

  const dataById = await getFilesData('id')
  const dataByTitle = await getFilesData('title')
  const dataByCite = await getFilesData('cite')
  await fs.promises.writeFile(join(notesDir, 'data', 'dataById.json'), JSON.stringify(dataById))
  await fs.promises.writeFile(
    join(notesDir, 'data', 'dataByTitle.json'),
    JSON.stringify(dataByTitle),
  )
  await fs.promises.writeFile(join(notesDir, 'data', 'dataByCite.json'), JSON.stringify(dataByCite))
}

// setup(readArgs)

import { clone } from 'isomorphic-git'
import fs from 'fs'
import { rm } from 'fs/promises'
import * as http from 'isomorphic-git/http/node/index.js'

import { getListOfCommitsWithStats } from '@zkp/git'
import { mdxDataBySlug } from '@zkp/mdx'
import * as dotenv from 'dotenv'

import {
  BASE_URL as repo,
  REMOTE as remoteUrl,
  APP_DIR as appDir,
  GIT_DIR as gitDir,
  NEXT_PUBLIC_NOTE_DIR as noteDir,
  DATA_DIR as dataDir,
} from '@zkp/paths'
import { flattenAndSlugifyNotes } from './flattenAndSlugifyNotes'

dotenv.config({ path: '../../../../.env' })

const args = process.argv

const setup = async ({
  remote = remoteUrl,
  //  appdir = appDir,
  gitdir = gitDir,
  notedir = noteDir,
  datadir = dataDir,
}) => {
  if (!remote) {
    console.error('Please first specify a remote for your notes in the options!')
    return
  }

  try {
    await rm(noteDir, { recursive: true, force: true })
  } catch (e) {
    console.log(e)
    console.log('No need to remove old notes')
  }
  try {
    await rm(dataDir, { recursive: true, force: true })
  } catch (e) {
    console.log('No need to remove old data')
  }
  // const firstCommit = '8a8d96b1a6ae75dd17f7462c31695823189f6f14'
  // const lastCommit = '635c1974031c9ba51e275c308ac38617bd8b5b46'
  await clone({
    fs,
    http,
    url: 'https://github.com/thomasfkjorna/thesis-writing',
    dir: notedir,
    gitdir: gitdir,
    remote: 'notes',
  })

  await getListOfCommitsWithStats('', '', notedir, gitdir, datadir)
  console.log({ datadir, notedir })
  const mdxData = await mdxDataBySlug(datadir, notedir)
  console.log('Done creating MDX data')
  await flattenAndSlugifyNotes({ notedir })
  // const dataById = await getFilesData('id', noteDir)
  // const dataByTitle = await getFilesData('title', noteDir)
  // const dataByCite = await getFilesData('cite', noteDir)
  // await fs.promises.writeFile(join(dataDir, 'dataById.json'), JSON.stringify(dataById))
  // await fs.promises.writeFile(join(dataDir, 'dataByTitle.json'), JSON.stringify(dataByTitle))
  // await fs.promises.writeFile(join(dataDir, 'dataByCite.json'), JSON.stringify(dataByCite))
}

setup({
  remote: args?.[2] || process.env.REMOTE,
  // appdir: args?.[3],
  gitdir: args?.[4] || process.env.GIT_DIR,
  notedir: args?.[5] || process.env.NOTE_DIR,
  datadir: args?.[6] || process.env.DATA_DIR,
})

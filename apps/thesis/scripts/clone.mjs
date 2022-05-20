import { clone } from 'isomorphic-git'
import fs from 'fs'
import * as http from 'isomorphic-git/http/node/index.cjs'
import { join } from 'path'
import { getListOfCommitsWithStats } from 'src/utils/getListOfCommitsWithStats'

const cwd = process.cwd()
const noteDir = join(cwd, 'notes')
const noteGitDir = join(cwd, 'notes', 'git')
await clone({
  fs,
  http,
  url: 'https://github.com/thomasfkjorna/thesis-writing',
  dir: noteDir,
  gitdir: noteGitDir,
  remote: 'notes',
})

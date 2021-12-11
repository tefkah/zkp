import { clone } from 'isomorphic-git'
import fs from 'fs'
import * as http from 'isomorphic-git/http/node/index.cjs'
import { join } from 'path'

const cwd = process.cwd()
await clone({
  fs,
  http,
  url: 'https://github.com/thomasfkjorna/thesis-writing',
  dir: join(cwd, 'notes'),
  gitdir: join(cwd, 'notes', 'git'),
  remote: 'notes',
})

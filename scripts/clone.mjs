import { clone } from 'isomorphic-git'
import fs from 'fs'
import * as http from 'isomorphic-git/http/node/index.cjs'

await clone({
  fs,
  http,
  url: 'https://github.com/thomasfkjorna/thesis-writing',
  dir: 'notes',
  gitdir: 'notes/git',
  remote: 'notes',
})

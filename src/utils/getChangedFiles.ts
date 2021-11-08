import { statusMatrix } from 'isomorphic-git'
import fs from 'fs'
export async function getChangedFiles(
  commitHash1: string,
  commitHash2: string,
  dir: string = 'notes',
  gitdir: string = `${dir}/git`,
) {
  // get the status of all the files in 'src'
  const status = await statusMatrix({
    fs,
    dir,
    gitdir,
    ref: commitHash2,
  })
  const files = status.filter((row) => row[2] !== 1)

  return files
}

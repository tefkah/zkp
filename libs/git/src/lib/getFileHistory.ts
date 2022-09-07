import { doSomethingAtFileStateChange } from './getFileStateChanges'

import fs from 'fs'
import git from 'isomorphic-git'
import { GIT_DIR } from '@zkp/paths'

export const getFileHistory = async ({ file, dir = GIT_DIR }: { file: string; dir?: string }) => {
  // PARAMETERS - CHANGE THESE FOR YOUR CODE
  // console.log(dir)
  const commits = await git.log({ fs, gitdir: dir })
  // console.log(commits)
  let lastSHA = null
  let lastCommit = null
  const commitsThatMatter = []
  for (const commit of commits) {
    try {
      const o = await git.readObject({ fs, dir, oid: commit.oid, filepath: file })
      if (o.oid !== lastSHA) {
        if (lastSHA !== null) commitsThatMatter.push(lastCommit)
        lastSHA = o.oid
      }
    } catch (err) {
      // file no longer there
      commitsThatMatter.push(lastCommit)
      break
    }
    lastCommit = commit
  }
  console.log(commitsThatMatter)
}

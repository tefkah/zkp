import type { NextApiRequest, NextApiResponse } from 'next'
import { Change } from 'diff'
import { join } from 'path'
import { getCommitDiffForSingleFile } from '../../../utils/getCommitDiff'
import { diffToString } from '../../../services/thesis/parseDiff'
import { FileDiff } from '../../../types'
import { getFileStateChanges } from '../../../utils/getFileStateChanges'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query
  if (slug && slug?.length < 2) {
    res.end(`Post: Error, api is like compare/commit1/commit2/file.`)
  }
  const cwd = process.cwd()
  const [commit1, commit2] = slug as string[]
  try {
    const diffs = await getFileStateChanges(
      commit1,
      commit2,
      join(cwd, 'notes'),
      join(cwd, 'notes', 'git'),
    )
    const inFileDiffs = diffs.map((file: FileDiff) => {
      if (!file) {
        return
      }
      return {
        file: file.filepath,
        diff: diffToString(file),
      }
    })

    res.status(200).json(inFileDiffs)
  } catch (e) {
    console.error(e)
  }
}

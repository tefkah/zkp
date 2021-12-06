import type { NextApiRequest, NextApiResponse } from 'next'
import { getCommitDiff } from '../../../utils/getCommitDiff'
import { Change } from 'diff'
import { join } from 'path'
import { diffToString } from '../../../server/parseDiff'
import { FileDiff } from '../../../api'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query
  if (slug && slug?.length < 2) {
    res.end(`Post: Error, api is like compare/commit1/commit2.`)
  }
  const cwd = process.cwd()
  const [commit1, commit2] = slug as string[]
  try {
    const diffs = await getCommitDiff(
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

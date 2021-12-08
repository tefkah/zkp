import type { NextApiRequest, NextApiResponse } from 'next'
import { getCommitDiffForSingleFile } from '../../../utils/getCommitDiff'
import { Change } from 'diff'
import { join } from 'path'
import { diffToString } from '../../../server/parseDiff'
import { FileDiff } from '../../../api'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query
  if (slug && slug?.length < 3) {
    res.end(`Post: Error, api is like compare/commit1/commit2/file.`)
  }
  const cwd = process.cwd()
  const [commit1, commit2, file] = slug as string[]
  try {
    const diffs = await getCommitDiffForSingleFile(
      commit1,
      commit2,
      join(cwd, 'notes'),
      join(cwd, 'notes', 'git'),
      file,
    )

    const inFileDiffs = diffs.map((file: FileDiff) => {
      if (!file) {
        return
      }
      return {
        file: file.filepath,
        additions: file.additions,
        deletions: file.deletions,
        diff: diffToString(file),
      }
    })

    res.status(200).json(inFileDiffs)
  } catch (e) {
    console.error(e)
    res.status(500)
  }
}

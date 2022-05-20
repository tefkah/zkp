import type { NextApiRequest, NextApiResponse } from 'next'
import { Change } from 'diff'
import { join } from 'path'
import { getCommitDiff } from '../../../utils/getCommitDiff'
import { diffToString } from '../../../services/thesis/parseDiff'
import { FileDiff } from '../../../types'

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { slug } = req.query
  if (slug && slug?.length < 2) {
    res.end(`Post: Error, api is like compare/commit1/commit2.`)
  }
  const [commit1, commit2] = slug as string[]
  try {
    const diffs = await getCommitDiff(commit1, commit2)
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

export default handler

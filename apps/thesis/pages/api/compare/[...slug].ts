import type { NextApiRequest, NextApiResponse } from 'next'
import { getCommitDiff } from '../../../utils/getCommitDiff'
import { diffToString } from '../../../services/thesis/parseDiff'
import { FileDiff } from '@zkp/types'

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { slug } = req.query
  if (slug && slug?.length < 2) {
    res.end(`Post: Error, api is like compare/commit1/commit2.`)
  }
  const [commit1, commit2] = slug as string[]
  try {
    const diffs = await getCommitDiff(commit1, commit2)
    const inFileDiffs = diffs
      .filter((file: FileDiff | undefined) => file)
      .map((file: Exclude<FileDiff, undefined>) => ({
        file: file.filepath,
        diff: diffToString(file),
      }))

    res.status(200).json(inFileDiffs)
  } catch (e) {
    console.error(e)
  }
}

export default handler

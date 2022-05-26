import type { NextApiRequest, NextApiResponse } from 'next'
import { getCommitDiffForSingleFile } from '../../../utils/getCommitDiff'
import { diffToString } from '../../../services/thesis/parseDiff'
import { FileDiff } from '@zkp/types'

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { slug } = req.query
  if (slug && slug?.length < 3) {
    res.end(`Post: Error, api is like compare/commit1/commit2/file.`)
  }
  //  const cwd = process.cwd()
  const [commit1, commit2, encodedFile] = slug as string[]
  const file = decodeURIComponent(encodedFile)
  try {
    const diffs = await getCommitDiffForSingleFile(
      commit1,
      commit2,
      undefined,
      undefined,
      //  join(cwd, 'notes'),
      //  join(cwd, 'notes', 'git'),
      file,
    )

    const inFileDiffs = diffs
      .filter((rawFile: FileDiff) => rawFile)
      .map((cleanFile: Exclude<FileDiff, undefined>) => ({
        file: cleanFile.filepath,
        additions: cleanFile.additions,
        deletions: cleanFile.deletions,
        diff: diffToString(cleanFile),
      }))

    res.status(200).json(inFileDiffs)
  } catch (e) {
    res.status(500)
    res.statusMessage = e as string
    console.error(e)
  }
}

export default handler

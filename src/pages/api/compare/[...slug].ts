import type { NextApiRequest, NextApiResponse } from 'next'
import { FileDiff, getModifiedCommitDiff } from '../../../utils/getCommitDiff'
import { Change } from 'diff'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query
  if (slug && slug?.length < 2) {
    res.end(`Post: Error, api is like compare/commit1/commit2.`)
  }
  const [commit1, commit2] = slug as string[]
  try {
    const diffs = await getModifiedCommitDiff(commit1, commit2, 'notes', 'notes/git')
    const inFileDiffs = diffs.map((file: FileDiff) => {
      if (!file) {
        return
      }
      return {
        file: file.filepath,
        diff: file?.diff
          .map((diff: Change) => {
            const type = diff.added ? '+++' : diff.removed ? '---' : ''
            return `${type}${diff.value}${type}`
          })
          .join(''),
      }
    })

    res.status(200).json(inFileDiffs)
  } catch (e) {
    console.error(e)
  }
}

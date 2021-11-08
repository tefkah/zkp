import type { NextApiRequest, NextApiResponse } from 'next'
import { getModifiedCommitDiff } from '../../../utils/getCommitDiff'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query
  console.log(slug)
  if (slug && slug?.length < 2) {
    res.end(`Post: Error, api is like compare/commit1/commit2.`)
  }
  const [commit1, commit2] = slug as string[]
  const x = await getModifiedCommitDiff(commit1, commit2, 'notes', 'notes/git')

  res.end(`Post: ${JSON.stringify(x)} `)
}

import type { NextApiRequest, NextApiResponse } from 'next'
import { getCommitDiff, getModifiedCommitDiff } from './getCommitDiff'

describe('diff api', () => {
  //   const [commit1, commit2] = [
  //     'f3887c2cfd1ba32073ec44f6d1c81f7689cd2eed',
  //     'dac9e2cf1d2d9964e7ddb375b692c71326776b64',
  //   ]
  const [commit1, commit2] = [
    '4cb1dd47256b7f9947af03c82672c567173003d1',
    '635c1974031c9ba51e275c308ac38617bd8b5b46',
  ]
  it('diffs', async () => {
    const x = await getModifiedCommitDiff(commit1, commit2, 'notes', 'notes/git')
    console.log(x)
    expect(x).toBeDefined()
  })
})

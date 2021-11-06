import type { NextApiRequest, NextApiResponse } from 'next'
import { log } from 'isomorphic-git'
import fs from 'fs'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query
  console.log(slug)
  if (slug && slug?.length < 2) {
    res.end(`Post: Error, api is like compare/commit1/commit2.`)
  }
  const [commit1, commit2] = slug as string[]
  const x = await fs.promises.readdir('./thesis-writings')
  console.log(x)

  const commits = await log({
    fs,
    dir: '../../../../thesis-writings',
  })
  res.end(`Post: ${commit1} is earlier then ${commit2}
  ${JSON.stringify(commits)}`)
}

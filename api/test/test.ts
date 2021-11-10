import fs from 'fs'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const x = fs.readFileSync('notes/so_2.org', { encoding: 'utf8' })

  res.status(200).json([x])
}

import fs from 'fs'
import { NextApiRequest, NextApiResponse } from 'next'
const { join } = require('path')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const cwd = process.cwd()
  console.log(cwd)
  const x = fs.readFileSync(`${cwd}/notes/so_2.org`, { encoding: 'utf8' })

  res.status(200).json([x])
}

import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs/promises'
import { join } from 'path'
import { mdxDataBySlug } from '../../../../utils/mdx/mdxDataBySlug'
import { BIB_PATH, NOTE_DIR } from '../../../../utils/paths'
import { mdxSerialize } from '../../../../utils/mdx/mdxSerialize'

export const handler: NextApiHandler<MDXRemoteSerializeResult> = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const { slug } = req.query
  if (Array.isArray(slug)) {
    res.status(404)
    return
  }

  // const { file } = props.params

  const data = await mdxDataBySlug()
  const path = data?.[slug].path

  if (!path) {
    res.status(404)
    return
  }
  try {
    const file = await fs.readFile(join(NOTE_DIR, path), 'utf8')
    const result = await mdxSerialize(file, BIB_PATH)

    res.status(200)
    res.json({ ...result })
  } catch (err) {
    res.status(500)
    res.json({ err })
  }
}

export default handler

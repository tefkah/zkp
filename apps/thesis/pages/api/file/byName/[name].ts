import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs/promises'
import { join } from 'path'
import { mdxDataByName } from '../../../../utils/mdx/mdxDataByName'
import { BIB_PATH, NEXT_PUBLIC_NOTE_DIR } from '../../../../utils/paths'
import { mdxSerialize } from '../../../../utils/mdx/mdxSerialize'

export const handler: NextApiHandler<MDXRemoteSerializeResult> = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const { name } = req.query
  if (Array.isArray(name)) {
    res.status(404)
    return
  }

  // const { file } = props.params

  const data = await mdxDataByName()
  //  console.log({ mdxDataByName: data })

  const path = data?.[name.toLowerCase()].path

  if (!path) {
    res.status(404)
    return
  }
  try {
    const file = await fs.readFile(join(NEXT_PUBLIC_NOTE_DIR, path), 'utf8')
    const result = await mdxSerialize(file, BIB_PATH)

    res.status(200)
    res.json({ ...result })
  } catch (err) {
    res.status(500)
    res.json({ err })
  }
}

export default handler

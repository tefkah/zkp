import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs/promises'
import { join } from 'path'
// import { mdxDataBySlug } from '../../../../utils/mdx/mdxDataBySlug'
import { BIB_PATH, NEXT_PUBLIC_NOTE_DIR } from '../../../../utils/paths'
import { mdxSerialize } from '../../../../utils/mdx/mdxSerialize'
import { deslugify } from '../../../../utils/slug'

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
  const url =
    process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_LOCAL_URL
      : process.env.NEXT_PUBLIC_PROD_URL
  // const dataBySlug =
  // console.dir(dataBySlug, { depth: null })
  //  const bo= await dataBySlug.json()
  const bod = await fetch(`${url?.replace(/(.)$/, '$1')}/notes/${slug}`)
  console.log(`${deslugify(slug)}.md`)
  const file = Buffer.from(await bod.arrayBuffer()).toString('utf-8')
  console.log('======FILE=======')
  console.log(file)
  // const data = await mdxDataBySlug()
  // const path = data?.[slug]?.path

  if (!file) {
    res.status(404)
    return
  }
  try {
    // const file = await fs.readFile(join(NEXT_PUBLIC_NOTE_DIR, path), 'utf8')
    const result = await mdxSerialize(file, BIB_PATH)
    console.log(result)
    res.status(200)
    res.json({ ...result })
  } catch (err) {
    console.error(err)
    res.status(500)
    res.json({ err })
  }
}

export default handler

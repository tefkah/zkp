import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { BIB_PATH } from '@zkp/paths'
import { mdxSerialize } from '@zkp/mdx'

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
      ? process.env.NEXT_PUBLIC_PROD_URL
      : process.env.NEXT_PUBLIC_LOCAL_URL

  // const dataBySlug =
  // console.dir(dataBySlug, { depth: null })
  //  const bo= await dataBySlug.json()
  const ur = `${url?.replace(/(.)$/, '$1')}/notes/${slug}`
  const bod = await fetch(ur)
  const file = Buffer.from(await bod.arrayBuffer()).toString('utf-8')
  // const data = await mdxDataBySlug()
  // const path = data?.[slug]?.path

  if (!file) {
    res.status(404)
    return
  }
  try {
    // const file = await fs.readFile(join(NEXT_PUBLIC_NOTE_DIR, path), 'utf8')
    const result = await mdxSerialize(file, BIB_PATH)
    res.setHeader('Cache-Control', 's-max-age=36000, stale-while-revalidate=100000')
    res.status(200)
    res.json({ ...result })
  } catch (err) {
    res.status(500)
    res.json({ err })
  }
}

export default handler

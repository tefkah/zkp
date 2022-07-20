import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
// import { mdxDataBySlug } from '@zkp/mdx'
import { BASE_URL } from '@zkp/paths'

export const handler: NextApiHandler<MDXRemoteSerializeResult> = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const { slug } = req.query
  if (Array.isArray(slug) || !slug) {
    res.status(404)
    return
  }

  // const { file } = props.params

  const allData = await (await fetch(`${BASE_URL}/data/dataBySlug.json`)).json()
  // mdxDataBySlug()
  const data = allData?.[slug]

  if (!data) {
    res.status(404)
    return
  }
  try {
    res.setHeader('Cache-Control', 's-max-age=36000, stale-while-revalidate=100000')
    res.status(200)
    res.json(data)
  } catch (err) {
    res.status(500)
    res.json({ err })
  }
}

export default handler

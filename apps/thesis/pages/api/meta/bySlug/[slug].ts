import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { mdxDataBySlug } from '../../../../utils/mdx/mdxDataBySlug'

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

  const allData = await mdxDataBySlug()
  const data = allData?.[slug]

  if (!data) {
    res.status(404)
    return
  }
  try {
    res.status(200)
    res.json(data)
  } catch (err) {
    res.status(500)
    res.json({ err })
  }
}

export default handler

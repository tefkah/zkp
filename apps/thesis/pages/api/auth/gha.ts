import { NextApiRequest, NextApiResponse } from 'next'
import { getAppAccessToken } from '../../../queries/getAccessToken'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  req.statusCode = 200
  const token = await getAppAccessToken('ThomasFKJorna/thesis-discussions')
  res.status(200).json({ token })
}

export default handler

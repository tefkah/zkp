import { NextApiRequest, NextApiResponse } from 'next'
import { getAppAccessToken } from '../../../queries/getAccessToken'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  req.statusCode = 200

  res.status(200).json(await getAppAccessToken('ThomasFKJorna/thesis-discussions'))
}

export default handler

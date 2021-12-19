import { NextApiRequest, NextApiResponse } from 'next'
import { getAppAccessToken } from '../../../queries/getAccessToken'
import { getGHAAccessToken } from '../../../queries/getGHAAccessToken'
import { getJWT } from '../../../queries/getJWTToken'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  req.statusCode = 200

  res.status(200).json(await getAppAccessToken('ThomasFKJorna/thesis-discussions'))
}

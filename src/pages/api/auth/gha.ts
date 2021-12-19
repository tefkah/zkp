import { NextApiRequest, NextApiResponse } from 'next'
import { getGHAAccessToken } from '../../../queries/getGHAAccessToken'
import { getJWT } from '../../../queries/getJWTToken'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  req.statusCode = 200

  const jwt = getJWT()
  res.status(200).json(await getGHAAccessToken(jwt))
}

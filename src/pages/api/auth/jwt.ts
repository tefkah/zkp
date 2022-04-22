import { NextApiRequest, NextApiResponse } from 'next'
import { getJWT } from '../../../queries/getJWTToken'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  req.statusCode = 200

  return getJWT()
}

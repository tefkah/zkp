import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { getJWT } from '../../../queries/getJWTToken'

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  req.statusCode = 200

  try {
    const jwt = getJWT()
    res.statusCode = 200
    res.json(jwt)
  } catch (e) {
    res.statusCode = 500
    res.statusMessage = e as string
    console.error(e)
  }
}

export default handler

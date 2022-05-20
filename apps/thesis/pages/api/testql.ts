import { NextApiRequest, NextApiResponse } from 'next'
import { getAppAccessToken } from '../../queries/getAccessToken'
import { getDiscussion } from '../../services/github/getDiscussion'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await getAppAccessToken('ThomasFKJorna/thesis-discussions')
  const discussion = await getDiscussion(
    {
      repo: 'ThomasFKJorna/thesis-discussions',
      term: 'Chapter Anyons',
      number: 0,
      category: '',
      first: 10,
    },
    token,
  )

  req.statusCode = 200
  res.status(200).json(discussion)
}

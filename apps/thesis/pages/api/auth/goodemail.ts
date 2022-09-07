import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'

// export const config = {
//   runtime: 'experimental-edge',
// }

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  const mails = process.env.ALLOWED_EMAILS?.split(',') || []

  res.setHeader('Cache-Control', 's-max-age=36000, stale-while-revalidate=100000')
  res.status(200).json({ access: mails?.includes(session?.user?.email as string) })
}

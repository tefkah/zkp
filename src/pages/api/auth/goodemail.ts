import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  const mails = process.env.ALLOWED_EMAILS?.split(',') || []

  req.statusCode = 200
  res.status(200).json({ access: mails?.includes(session?.user?.email as string) })
}

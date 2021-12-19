import { NextApiRequest, NextApiResponse } from 'next'
import { Octokit } from 'octokit'
import { createAppAuth } from '@octokit/auth-app'
import { getSession } from 'next-auth/react'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  const token = session?.accessToken
  //   const octokit = new Octokit({
  //     appId: 1,
  //     authStrategy: createAppAuth,
  //     privateKey: process.env.PRIVATE_KEY
  //   })

  req.statusCode = 200
  res.status(200).json(token)
}

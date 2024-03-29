// adapted from https://github.com/giscus/giscus/blob/main/pages/api/discussions/categories.ts

import type { NextApiRequest, NextApiResponse } from 'next'
import { IError, IGiscussion, GRepositoryDiscussion } from '@zkp/types'
import {
  adaptDiscussion,
  createDiscussion,
  getAppAccessToken,
  getDiscussion,
  filterDiscussionByCommentID,
} from '@zkp/discus'
// import { getAppAccessToken } from '../../../queries/getAccessToken'
// import { createDiscussion } from '../../../services/github/createDiscussion'
// import { getDiscussion } from '../../../services/github/getDiscussion'
// import { adaptDiscussion } from '../../../utils/giscus/adapter'

const get = async (req: NextApiRequest, res: NextApiResponse<IGiscussion | IError>) => {
  const params = {
    repo: req.query.repo as string,
    term: req.query.term as string,
    number: Number(req?.query?.number) || undefined,
    category: req.query.category as string,
    first: Number(req?.query?.first) || undefined,
    last: Number(req?.query?.last) || undefined,
    after: req.query.after as string,
    before: req.query.before as string,
    commentId: req.query.commentId as string,
  }
  if (!params.last && !params.first) {
    params.first = 20
  }

  const userToken = req.headers.authorization?.split('Bearer ')[1]

  let token = userToken
  if (!token) {
    try {
      token = await getAppAccessToken(params.repo)
    } catch (error) {
      // @ts-expect-error error is of certain type
      res.status(403).json({ error: error.message })
      return
    }
  }

  const response = await getDiscussion(params, token)

  if ('message' in response) {
    if (response?.message?.includes('Bad credentials')) {
      res.status(403).json({ error: response.message })
      return
    }
    res.status(500).json({ error: response.message })
    return
  }

  if ('errors' in response) {
    const error = response.errors[0]
    if (error?.message?.includes('API rate limit exceeded')) {
      let message = `API rate limit exceeded for ${params.repo}`
      if (!userToken) {
        message += '. Sign in to increase the rate limit'
      }
      res.status(429).json({ error: message })
      return
    }

    console.error(response)
    const message =
      response.errors.map?.(({ message: repsonseMessage }) => repsonseMessage).join('. ') ||
      'Unknown error'
    res.status(500).json({ error: message })
    return
  }

  const { data } = response
  if (!data) {
    console.error(response)
    res.status(500).json({ error: 'Unable to fetch discussion' })
    return
  }

  const { viewer } = data

  let discussion: GRepositoryDiscussion | null
  if ('search' in data) {
    const { search } = data
    const { discussionCount, nodes } = search
    discussion = discussionCount > 0 ? nodes[0] : null
  } else {
    discussion = data.repository.discussion
  }

  if (!discussion) {
    res.status(404).json({ error: 'Discussion not found' })
    return
  }

  let adapted = adaptDiscussion({ viewer, discussion })
  if (!adapted.discussion) {
    res.status(500).json({ error: 'Something went wrong when formatting the disccusion' })
    return
  }

  if (params.commentId) {
    adapted = filterDiscussionByCommentID(adapted, params.commentId)
  }

  res.status(200).json(adapted)
}

const post = async (req: NextApiRequest, res: NextApiResponse<{ id: string } | IError>) => {
  const { repo, input } = req.body

  let token: string
  try {
    token = await getAppAccessToken(repo)
  } catch (error) {
    // @ts-expect-error error is of certain type
    res.status(403).json({ error: error.message })
    return
  }

  const response = await createDiscussion(token, { input })
  const id = response?.data?.createDiscussion?.discussion?.id

  if (!id) {
    res.status(400).json({ error: 'Unable to create discussion with request body.' })
    return
  }

  res.status(200).json({ id })
}

export const discussionsApi = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    await post(req, res)
    return
  }
  await get(req, res)
}

export default discussionsApi

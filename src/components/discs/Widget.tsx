import { useCallback, useContext, useEffect, useState } from 'react'
import Giscus from './Giscus'
import { IErrorMessage } from '../../lib/giscus'
import { createDiscussion } from '../../services/giscus/createDiscussion'
import { getToken } from '../../services/giscus/token'
import { useSession } from 'next-auth/react'

interface IWidgetProps {
  origin: string
  repoId: string
  categoryId: string
  category: string
  description: string
  repo: string
  term: string
  number?: number
}

export default function Widget({
  repo,
  term,
  number,
  origin,
  repoId,
  category,
  categoryId,
  description,
}: IWidgetProps) {
  const { data: sesh } = useSession()
  const token = sesh?.accessToken
  const handleDiscussionCreateRequest = async () =>
    createDiscussion(repo, {
      repositoryId: repoId,
      categoryId,
      title: term!,
      body: `# ${term}\n\n${description || ''}\n\n${origin}`,
    })

  const handleError = useCallback(
    (message: string) => {
      console.error(message)
    },
    [origin],
  )

  const ready = token && repo && (term || number)

  return ready ? (
    <Giscus
      {...{
        repo,
        term,
        number,
        category,
      }}
      onDiscussionCreateRequest={handleDiscussionCreateRequest}
      onError={handleError}
    />
  ) : null
}

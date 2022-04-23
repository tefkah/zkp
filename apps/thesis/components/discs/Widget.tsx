// ported from the great https://github.com/giscus/giscus

import { useCallback } from 'react'
import useSWR from 'swr'
import { Giscus } from './Giscus'
import { createDiscussion } from '../../services/giscus/createDiscussion'

interface IWidgetProps {
  origin: string
  repoId: string
  categoryId: string
  category: string
  description: string
  repo: string
  term: string
  number?: number
  full?: boolean
}

export const Widget = ({
  repo,
  term,
  number,
  origin,
  repoId,
  category,
  categoryId,
  description,
  full,
}: IWidgetProps) => {
  const { data: token } = useSWR('/api/auth/gha')
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
      full={full}
    />
  ) : null
}

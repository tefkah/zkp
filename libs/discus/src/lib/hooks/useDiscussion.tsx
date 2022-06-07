import { DiscussionQuery, IGiscussion, IComment, IReply, PaginationParams } from '@zkp/types'
import { useState, useMemo, useCallback } from 'react'
import { SWRConfig } from 'swr'
import { cleanParams, fetcher } from '../utils'
import useSWRInfinite from 'swr/infinite'
import { deleteReply } from './deleteReply'
import { deleteComment } from './deleteComment'
import { updateReply } from './updateReply'
import { addNewComment } from './addNewComment'
import { addNewReply } from './addNewReply'
import { updateDiscussion } from './updateDiscussion'
import { updateComment } from './updateComment'

export const useDiscussion = (
  query: DiscussionQuery,
  token?: string,
  pagination: PaginationParams = {},
) => {
  const [errorStatus, setErrorStatus] = useState(0)

  const urlParams = new URLSearchParams(cleanParams({ ...query, ...pagination }))

  const headers = useMemo(() => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {}
    return { headers }
  }, [token])

  const getKey = (pageIndex: number, previousPageData?: IGiscussion) => {
    if (pagination.first === 0 || pagination.last === 0) return null
    if (pageIndex === 0) return [`/api/discussions?${urlParams}`, headers]
    if (!previousPageData?.discussion?.pageInfo?.hasNextPage) return null
    const params = new URLSearchParams(
      cleanParams({
        ...query,
        after: previousPageData.discussion.pageInfo.endCursor,
        before: pagination.before,
      }),
    )
    return [`/api/discussions?${params}`, headers]
  }

  const shouldRevalidate = (status: number) => ![403, 404, 429].includes(status)

  const { data, size, setSize, error, mutate, isValidating } = useSWRInfinite<IGiscussion>(
    getKey,
    fetcher,
    {
      onErrorRetry: (err, key, config, revalidate, opts) => {
        if (!shouldRevalidate(err?.status)) return
        SWRConfig.default.onErrorRetry(err, key, config, revalidate, opts)
      },
      revalidateOnMount: shouldRevalidate(errorStatus),
      revalidateOnFocus: shouldRevalidate(errorStatus),
      revalidateOnReconnect: shouldRevalidate(errorStatus),
    },
  )

  if (error?.status && error.status !== errorStatus) {
    setErrorStatus(error.status)
  } else if (!error?.status && errorStatus) {
    setErrorStatus(0) // Clear error
  }

  return {
    data: data ?? [],
    error,
    size,
    setSize,
    isValidating,
    isLoading: !error && !data,
    isError: !!error,
    mutators: {
      addNewComment: addNewComment({ data, mutate }),
      addNewReply: addNewReply({ data, mutate }),
      updateDiscussion: updateDiscussion({ mutate }),
      updateComment: updateComment({ mutate, data }),
      updateReply: updateReply({ mutate, data }),
      deleteComment: deleteComment({ mutate, data }),
      deleteReply: deleteReply({ mutate, data }),
      mutate,
    },
  }
}

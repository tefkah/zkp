import { DiscussionQuery, IGiscussion, IComment, IReply, PaginationParams } from '@zkp/types'
import { useState, useMemo, useCallback } from 'react'
import { SWRConfig } from 'swr'
import { cleanParams, fetcher } from '../utils'
import useSWRInfinite from 'swr/infinite'

export const useDiscussion = (
  query: DiscussionQuery,
  token?: string,
  pagination: PaginationParams = {},
) => {
  const [errorStatus, setErrorStatus] = useState(0)
  const urlParams = new URLSearchParams(cleanParams({ ...query, ...pagination }))

  const headers = useMemo(() => {
    const header = token ? { Authorization: `Bearer ${token}` } : {}
    return { header }
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

  const addNewComment = useCallback(
    (comment: IComment) => {
      if (!data) return mutate()
      const firstPage = data.slice(0, data.length - 1)
      const [lastPage] = data.slice(-1)
      mutate(
        [
          ...firstPage,
          {
            ...lastPage,
            discussion: {
              ...lastPage.discussion,
              comments: [...(lastPage.discussion?.comments || []), comment],
            },
          },
        ],
        false,
      )
      return mutate()
    },
    [data, mutate],
  )

  const addNewReply = useCallback(
    (reply: IReply) => {
      const newData = data?.map((page) => ({
        ...page,
        discussion: {
          ...page.discussion,
          comments: page.discussion.comments.map((comment) =>
            comment.id === reply.replyToId
              ? { ...comment, replies: [...comment.replies, reply] }
              : comment,
          ),
        },
      }))
      mutate(newData, false)
      return mutate()
    },
    [data, mutate],
  )

  const updateDiscussion = useCallback(
    (newDiscussions: IGiscussion[], promise?: Promise<unknown>) =>
      mutate(newDiscussions, !promise).then(() => promise?.then(() => mutate())),
    [mutate],
  )

  const updateComment = useCallback(
    (newComment: IComment, promise?: Promise<unknown>) =>
      mutate(
        data?.map((page) => ({
          ...page,
          discussion: {
            ...page.discussion,
            comments: page.discussion.comments.map((comment) =>
              comment.id === newComment.id ? newComment : comment,
            ),
          },
        })),
        !promise,
      ).then(() => promise?.then(() => mutate())),
    [data, mutate],
  )

  const updateReply = useCallback(
    (newReply: IReply, promise?: Promise<unknown>) =>
      mutate(
        data?.map((page) => ({
          ...page,
          discussion: {
            ...page.discussion,
            comments: page.discussion.comments.map((comment) =>
              comment.id === newReply.replyToId
                ? {
                    ...comment,
                    replies: comment.replies.map((reply) =>
                      reply.id === newReply.id ? newReply : reply,
                    ),
                  }
                : comment,
            ),
          },
        })),
        !promise,
      )
        .then(() => promise?.then(() => mutate()))
        .catch((e) => console.error(e)),
    [data, mutate],
  )

  return {
    data: data ?? [],
    error,
    size,
    setSize,
    isValidating,
    isLoading: !error && !data,
    isError: !!error,
    mutators: {
      addNewComment,
      addNewReply,
      updateDiscussion,
      updateComment,
      updateReply,
      mutate,
    },
  }
}

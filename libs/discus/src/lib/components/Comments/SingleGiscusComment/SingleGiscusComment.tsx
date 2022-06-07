/* eslint-disable no-nested-ternary */
// ported from the great https://github.com/giscus/giscus
import { Waveform } from '@uiball/loaders'
import { useSession } from 'next-auth/react'
import { useCookies } from 'react-cookie'
import { useEffect } from 'react'
import { VscCircleFilled } from 'react-icons/vsc'
import { Comment } from '../Comment/Comment'
import { CommentBox } from '../CommentBox'
import { ReactButtons } from '../ReactButtons'
import { Button, Container } from '@zkp/ui'
import Link from 'next/link'
import { useFrontBackDiscussion } from '../../../hooks/useFrontBackDiscussion'

export interface GiscusProps {
  onDiscussionCreateRequest?: () => Promise<string>
  onError?: (message: string) => void
  repo: string
  term: string
  number?: number
  category: string
  full?: boolean
}

export const SingleGiscusComment = ({
  repo,
  term,
  number,
  commentID,
  category,
  full,
  onDiscussionCreateRequest,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onError,
}: GiscusProps & { commentID: string }) => {
  const { data: session } = useSession()

  const token = session?.accessToken as string

  const query = { repo, term, category, number }

  const {
    updateReactions,
    increaseSize,
    backMutators,
    frontMutators,
    isLoading,
    error,
    discussion,
    isRateLimited,
    isLocked,
    totalCommentCount,
    totalReplyCount,
    backData,
    isNotFound,
    viewer,
    ...data
  } = useFrontBackDiscussion(query, token)

  // const [cookies, setCookie] = useCookies<string>([])
  //  useEffect(() => {
  //    console.log(data)
  //    if (data.error && onError) {
  //      console.log(data)
  //     onError(data?.error?.message as string)
  //    }
  //  }, [data.error, onError])

  const handleDiscussionCreateRequest = async () => {
    const id = onDiscussionCreateRequest ? await onDiscussionCreateRequest() : ''
    // Force revalidate
    frontMutators.mutate()
    backMutators.mutate()
    return id
  }

  const shouldCreateDiscussion = isNotFound && !number
  //  const shouldShowBranding = !!data.discussion.url

  const isDataLoaded = !error && !isNotFound && !isLoading

  const shouldShowReplyCount = isDataLoaded && totalReplyCount > 0

  const shouldShowCommentBox =
    (isRateLimited && !token) || (!isLoading && !isLocked && (!error || (isNotFound && !number)))

  // useEffect(() => {
  //   if (isDataLoaded) {
  //     setCookie('visit', {
  //       ...cookies.visit,
  //       [term]: {
  //         lastVisit: new Date().toISOString(),
  //         totalCount: data.totalCommentCount || 0 + data.totalReplyCount || 0,
  //         commentCount: data.totalCommentCount || 0,
  //         replyCount: data.totalReplyCount || 0,
  //       },
  //     })
  //   }
  // }, [data])

  return (
    <div className="flex w-full flex-col items-start gap-10">
      <div className="w-full">
        <div className="flex flex-col">
          <div className="gsc-header flex flex-auto items-center justify-start gap-4 whitespace-nowrap pb-2">
            {!isLoading && (shouldCreateDiscussion || !error) ? (
              <div className="flex text-sm">
                <ReactButtons
                  subjectId={discussion.id}
                  reactionGroups={discussion.reactions}
                  onReact={updateReactions}
                  onDiscussionCreateRequest={handleDiscussionCreateRequest}
                />
              </div>
            ) : null}
            <h4 className="gsc-comments-count mr2 text-sm font-normal">
              {shouldCreateDiscussion && !totalCommentCount ? (
                '0 Comments'
              ) : error && !backData ? (
                'Something went wrong'
              ) : isLoading ? (
                <span className="flex items-center gap-4">
                  <Waveform /> <p>Loading Comments</p>
                </span>
              ) : (
                <Link href={discussion.url} passHref>
                  <a className="color-text-primary">{`${totalCommentCount} comments`}</a>
                </Link>
              )}
            </h4>
            {shouldShowReplyCount ? (
              <div className="ml-2 flex items-center gap-2">
                <h4 className="text-sm font-semibold">
                  <VscCircleFilled />
                </h4>
                <h4
                  // mr={2}
                  // size="md"
                  // as="h4"
                  // fontWeight="semibold"
                  className="gsc-replies-count text-md mr-2 font-semibold"
                >
                  {`${totalReplyCount} ${totalReplyCount === 1 ? 'reply' : 'replies'}`}
                </h4>
              </div>
            ) : null}
          </div>

          <div className="gsc-timeline flex flex-col">
            {!isLoading
              ? data.frontComments.map((comment) => (
                  <Comment
                    key={comment.id}
                    comment={comment}
                    replyBox={
                      token && !isLocked ? (
                        <CommentBox
                          discussionId={discussion.id}
                          context={repo}
                          // @ts-expect-error the type is just wrong, don't feel like fixing
                          onSubmit={frontMutators.addNewReply}
                          replyToId={comment.id}
                          viewer={viewer}
                        />
                      ) : undefined
                    }
                    onCommentUpdate={frontMutators.updateComment}
                    onReplyUpdate={frontMutators.updateReply}
                  />
                ))
              : null}

            {/* {data.numHidden > 0 ? (
              <div
                // bg="center"
                // bgRepeat="x"
                className="pagination-loader-container gsc-pagination my-4 flex justify-center py-2"
              >
                <Button
                  // display="flex"
                  // flexDir="column"
                  // justifyContent="center"
                  // alignItems="center"
                  // px={6}
                  // py={2}
                  // fontSize="sm"
                  className="flex flex-col items-center justify-center px-6 py-2 text-sm"
                  onClick={increaseSize}
                  disabled={data.isLoadingMore}
                >
                  <span className="color-text-secondary">{`${data.numHidden} hidden comments`}</span>
                  <span className="color-text-link font-semibold">
                    {data.isLoadingMore ? 'Loading' : 'Load more'}…
                  </span>
                </Button>
              </div>
            ) : null} */}

            {!isLoading
              ? data.backComments?.map((comment) => (
                  <Comment
                    key={comment.id}
                    comment={comment}
                    replyBox={
                      token && !isLocked ? (
                        <CommentBox
                          discussionId={discussion.id}
                          context={repo}
                          // @ts-expect-error the type is just wrong, don't feel like fixing
                          onSubmit={backMutators.addNewReply}
                          replyToId={comment.id}
                          viewer={viewer}
                        />
                      ) : undefined
                    }
                    onCommentUpdate={backMutators.updateComment}
                    onReplyUpdate={backMutators.updateReply}
                  />
                ))
              : null}
          </div>

          {shouldShowCommentBox ? (
            <>
              <div
                // my={4}
                // fontSize="sm"
                // borderTop={2}
                className="gsc-comment-box-separator color-border-primary my-4 border-t-2 text-sm text-slate-700"
                // color="grey.700"
              />
              <CommentBox
                viewer={viewer}
                discussionId={discussion.id}
                context={repo}
                // @ts-expect-error the type is just wrong, don't feel like fixing
                onSubmit={backMutators.addNewComment}
                onDiscussionCreateRequest={handleDiscussionCreateRequest}
              />
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}

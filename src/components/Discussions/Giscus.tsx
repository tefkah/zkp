import { useSession } from 'next-auth/react'
import React from 'react'
import { useFrontBackDiscussion } from '../../services/giscus/discussions'
import { createDiscussion } from '../../services/github/createDiscussion'
import Comment from './Comment'
import { Text } from '@chakra-ui/react'

interface Props {
  repo: string
  repoId: string
  term: string
  number: number
  category: string
}

export const Giscus = (props: Props) => {
  const { repo, repoId, term, number, category } = props
  const { updateReactions, increaseSize, backMutators, frontMutators, ...data } =
    useFrontBackDiscussion({
      repo,
      term,
      number: number || 0,
      category: category || '',
    })

  const onDiscussionCreateRequest = async () =>
    createDiscussion(repo, {
      input: {
        repositoryId: repoId,
        categoryId: '',
        title: term,
        body: `# ${term}\n\n${''}\n\n${origin}`,
      },
    })

  const handleDiscussionCreateRequest = async () => {
    const id = await onDiscussionCreateRequest()
    // Force revalidate
    frontMutators.mutate()
    backMutators.mutate()
    return id
  }
  const { data: session } = useSession()
  const query = { repo, term, category, number }

  const shouldCreateDiscussion = data.isNotFound && !number
  const shouldShowBranding = !!data.discussion.url

  const shouldShowReplyCount =
    !data.error && !data.isNotFound && !data.isLoading && data.totalReplyCount > 0

  const shouldShowCommentBox =
    (data.isRateLimited && !token) ||
    (!data.isLoading && !data.isLocked && (!data.error || (data.isNotFound && !number)))

  return (
    <div className="color-text-primary gsc-main">
      {!data.isLoading && (shouldCreateDiscussion || !data.error) ? (
        <div className="gsc-reactions">
          <h4 className="gsc-reactions-count">
            {shouldCreateDiscussion && !data.reactionCount ? (
              <Text> '0 Reactions'</Text>
            ) : (
              <a
                href={data.discussion.url}
                target="_blank"
                rel="noreferrer noopener nofollow"
                className="color-text-primary"
              >
                {data.reactionCount} reactions
              </a>
            )}
          </h4>
          <div className="flex justify-center flex-auto mt-2 text-sm">
            {/* <ReactButtons
              subjectId={data.discussion.id}
              reactionGroups={data.discussion.reactions}
              onReact={updateReactions}
              onDiscussionCreateRequest={handleDiscussionCreateRequest}
            /> */}
          </div>
        </div>
      ) : null}

      <div className="gsc-comments">
        <div className="gsc-header">
          <h4 className="gsc-comments-count">
            {shouldCreateDiscussion && !data.totalCommentCount ? (
              '0 Comments'
            ) : (
              <a
                href={data.discussion.url}
                target="_blank"
                rel="noreferrer noopener nofollow"
                className="color-text-primary"
              >
                {data.totalCommentCount} comments
              </a>
            )}
          </h4>
          {shouldShowReplyCount ? (
            <>
              <h4 className="gsc-comments-count-separator">·</h4>
              <h4 className="gsc-replies-count">
                {data.totalReplyCount} replies + {data.numHidden > 0 ? '+' : ''} hidden replies
              </h4>
            </>
          ) : null}
        </div>

        <div className="gsc-timeline">
          {!data.isLoading
            ? data.frontComments.map((comment) => (
                <Comment
                  key={comment.id}
                  comment={comment}
                  replyBox={
                    false && token && !data.isLocked ? (
                      <CommentBox
                        discussionId={data.discussion.id}
                        context={repo}
                        onSubmit={frontMutators.addNewReply}
                        replyToId={comment.id}
                        viewer={data.viewer}
                      />
                    ) : undefined
                  }
                  onCommentUpdate={frontMutators.updateComment}
                  onReplyUpdate={frontMutators.updateReply}
                />
              ))
            : null}

          {data.numHidden > 0 ? (
            <div className="pagination-loader-container gsc-pagination">
              <button
                className="flex flex-col items-center px-6 py-2 text-sm border rounded color-bg-primary color-border-primary"
                onClick={increaseSize}
                disabled={data.isLoadingMore}
              >
                <span className="color-text-secondary">{data.numHidden} hidden items</span>
                <span className="font-semibold color-text-link">
                  {data.isLoadingMore ? 'Loading...' : 'Load more'}
                </span>
              </button>
            </div>
          ) : null}

          {!data.isLoading
            ? data.backComments?.map((comment) => (
                <Comment
                  key={comment.id}
                  comment={comment}
                  replyBox={
                    false && token && !data.isLocked ? (
                      <CommentBox
                        discussionId={data.discussion.id}
                        context={repo}
                        onSubmit={backMutators.addNewReply}
                        replyToId={comment.id}
                        viewer={data.viewer}
                      />
                    ) : undefined
                  }
                  onCommentUpdate={backMutators.updateComment}
                  onReplyUpdate={backMutators.updateReply}
                />
              ))
            : null}
        </div>

        {false && shouldShowCommentBox ? (
          <>
            <hr className="gsc-comment-box-separator color-border-primary" />
            <CommentBox
              viewer={data.viewer}
              discussionId={data.discussion.id}
              context={repo}
              onSubmit={backMutators.addNewComment}
              onDiscussionCreateRequest={handleDiscussionCreateRequest}
            />
          </>
        ) : null}
      </div>
    </div>
  )
}

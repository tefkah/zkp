import { Link as ChakraLink, Box, Heading, Flex, Button } from '@chakra-ui/react'
import { useSession } from 'next-auth/react'
import { useContext, useEffect } from 'react'
import { IMetadataMessage } from '../../lib/giscus'
import { useFrontBackDiscussion } from '../../services/giscus/discussions'
import Comment from './Comment'
import CommentBox from './CommentBox'
import ReactButtons from './ReactButtons'

interface IGiscusProps {
  onDiscussionCreateRequest?: () => Promise<string>
  onError?: (message: string) => void
  repo: string
  term: string
  number?: number
  category: string
}

export default function Giscus({
  repo,
  term,
  number,
  category,
  onDiscussionCreateRequest,
  onError,
}: IGiscusProps) {
  const { data: session } = useSession()
  const token = session?.accessToken as string
  const query = { repo, term, category, number }

  const { updateReactions, increaseSize, backMutators, frontMutators, ...data } =
    useFrontBackDiscussion(query, token)

  // useEffect(() => {
  //   console.log(data)
  //   if (data.error && onError) {
  //     console.log(data)
  //     onError(data?.error?.message as string)
  //   }
  // }, [data.error, onError])

  const handleDiscussionCreateRequest = async () => {
    const id = onDiscussionCreateRequest ? await onDiscussionCreateRequest() : ''
    // Force revalidate
    frontMutators.mutate()
    backMutators.mutate()
    return id
  }

  const shouldCreateDiscussion = data.isNotFound && !number
  const shouldShowBranding = !!data.discussion.url

  const shouldShowReplyCount =
    !data.error && !data.isNotFound && !data.isLoading && data.totalReplyCount > 0

  const shouldShowCommentBox =
    (data.isRateLimited && !token) ||
    (!data.isLoading && !data.isLocked && (!data.error || (data.isNotFound && !number)))

  return (
    <Box className="color-text-primary gsc-main" w="full">
      {!data.isLoading && (shouldCreateDiscussion || !data.error) ? (
        <Flex className="gsc-reactions" flexDir="column" justifyContent="center" flex="auto" mb={4}>
          <Heading size="md" fontWeight="500" as="h4" className="gsc-reactions-count">
            {shouldCreateDiscussion && !data.reactionCount ? (
              '0 reactions'
            ) : (
              <ChakraLink
                isExternal
                rel="noreferrer noopener nofollow"
                className="color-text-primary"
              >
                {`${data.reactionCount || 0} reactions`}
              </ChakraLink>
            )}
          </Heading>
          <Flex
            justifyContent="center"
            flex="auto"
            mt={2}
            fontSize="sm"
            className="flex justify-center flex-auto mt-2 text-sm"
          >
            <ReactButtons
              subjectId={data.discussion.id}
              reactionGroups={data.discussion.reactions}
              onReact={updateReactions}
              onDiscussionCreateRequest={handleDiscussionCreateRequest}
            />
          </Flex>
        </Flex>
      ) : null}

      <Flex flexDir="column" className="gsc-comments">
        <Flex
          className="gsc-header"
          flexWrap="wrap"
          items="center"
          flex="auto"
          pb={2}
          whiteSpace="nowrap"
        >
          <Heading mr={2} fontWeight="semibold" size="md" as="h4" className="gsc-comments-count">
            {shouldCreateDiscussion && !data.totalCommentCount ? (
              '0 Comments'
            ) : data.error && !data.backData ? (
              'Something went wrong'
            ) : data.isLoading ? (
              'Loading Comments'
            ) : (
              <ChakraLink href={data.discussion.url} isExternal className="color-text-primary">
                {`${data.totalCommentCount} comments`}
              </ChakraLink>
            )}
          </Heading>
          {shouldShowReplyCount ? (
            <>
              <Heading
                mr={2}
                fontWeight="semibold"
                as="h4"
                className="gsc-comments-count-separator"
              >
                ·
              </Heading>
              <Heading mr={2} size="md" as="h4" className="gsc-replies-count">
                {`${data.totalReplyCount} replies`}
              </Heading>
            </>
          ) : null}
        </Flex>

        <Flex flexDir="column" className="gsc-timeline">
          {!data.isLoading
            ? data.frontComments.map((comment) => (
                <Comment
                  key={comment.id}
                  comment={comment}
                  replyBox={
                    token && !data.isLocked ? (
                      <CommentBox
                        discussionId={data.discussion.id}
                        context={repo}
                        //@ts-expect-error
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
            <Flex
              justifyContent="center"
              py={2}
              my={4}
              bg="center"
              bgRepeat="x"
              className="pagination-loader-container gsc-pagination"
            >
              <Button
                display="flex"
                flexDir="column"
                items="center"
                px={6}
                py={2}
                fontSize="sm"
                className="flex flex-col items-center px-6 py-2 text-sm border rounded color-bg-primary color-border-primary"
                onClick={increaseSize}
                disabled={data.isLoadingMore}
              >
                <span className="color-text-secondary">{`${data.numHidden} hidden comments`}</span>
                <span className="font-semibold color-text-link">
                  {data.isLoadingMore ? 'Loading' : 'Load more'}…
                </span>
              </Button>
            </Flex>
          ) : null}

          {!data.isLoading
            ? data.backComments?.map((comment) => (
                <Comment
                  key={comment.id}
                  comment={comment}
                  replyBox={
                    token && !data.isLocked ? (
                      <CommentBox
                        discussionId={data.discussion.id}
                        context={repo}
                        //@ts-expect-error
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
        </Flex>

        {shouldShowCommentBox ? (
          <>
            <Box
              as="hr"
              my={4}
              fontSize="sm"
              borderTop={2}
              className="gsc-comment-box-separator color-border-primary"
            />
            <CommentBox
              viewer={data.viewer}
              discussionId={data.discussion.id}
              context={repo}
              //@ts-expect-error
              onSubmit={backMutators.addNewComment}
              onDiscussionCreateRequest={handleDiscussionCreateRequest}
            />
          </>
        ) : null}
      </Flex>
    </Box>
  )
}

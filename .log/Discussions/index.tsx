import { Box } from '@chakra-ui/react'
import { useSession } from 'next-auth/react'
import React from 'react'
import { useDiscussion } from '../../hooks/useDiscussion'
import { PaginationParams } from '../../lib/common'
import { GetDiscussionParams } from '../../queries/getDiscussion'
import { useFrontBackDiscussion } from '../../services/giscus/discussions'

interface Props extends GetDiscussionParams {}

export default function Discussion(props: Props) {
  const { repo, number, term, category, ...pagination } = props
  const { isLoading, error, ...data } = useFrontBackDiscussion({
    repo,
    term,
    number: number || 0,
    category: category || '',
    ...pagination,
  })
  return <Box>{isLoading ? 'loading' : JSON.stringify(data)}</Box>
}

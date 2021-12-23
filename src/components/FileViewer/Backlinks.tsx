import { Text, Box, Heading, VStack } from '@chakra-ui/react'
import Link from 'next/link'
import React, { useMemo } from 'react'
import { Data } from '../../services/thesis/parseOrg'
import { FilesData } from '../../utils/IDIndex/getFilesData'
import { slugify } from '../../utils/slug'
import { PreviewLink } from './Link'

interface Props {
  data: Data
  backLinks: string[]
}

export const Backlinks = (props: Props) => {
  const { data, backLinks } = props

  const links = useMemo(() => {
    return backLinks.map((link) => {
      const title = data.data?.[link]?.title ?? ''
      const text = data.orgTexts[link]
      return (
        <PreviewLink
          key={title}
          data={data.data}
          title={title}
          orgText={text}
          href={`/${slugify(title)}`}
        >
          {title}
        </PreviewLink>
      )
    })
  }, [backLinks])
  return (
    <Box my={8}>
      <Heading size="md">References to this note</Heading>
      <VStack mt={4} spacing={2} alignItems="flex-start">
        {links}
      </VStack>
    </Box>
  )
}

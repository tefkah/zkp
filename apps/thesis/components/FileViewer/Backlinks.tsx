import { Box, Heading, VStack, useColorModeValue } from '@chakra-ui/react'
import React, { useMemo } from 'react'
import { FilesData } from '../../utils/IDIndex/getFilesData'
import { slugify } from '../../utils/slug'
import { PreviewLink } from './Link'

interface Props {
  data: FilesData
  backLinks: string[]
  currentId: string
}

export const Backlinks = (props: Props) => {
  const { currentId, data, backLinks } = props

  const background = useColorModeValue('brand.50', 'brand.100')
  const links = useMemo(
    () =>
      backLinks.map((link) => {
        const title = data?.[link]?.title ?? ''
        return (
          <PreviewLink
            backlink
            currentId={currentId}
            key={title}
            data={data}
            title={title}
            id={link}
            href={`/${slugify(title)}`}
          >
            {title}
          </PreviewLink>
        )
      }),
    [backLinks],
  )
  return (
    <Box my={8} backgroundColor={background} p={4} borderRadius="lg">
      <Heading size="md" color="brand.700">
        References to this note
      </Heading>
      <VStack mt={4} spacing={4} alignItems="flex-start">
        {links}
      </VStack>
    </Box>
  )
}

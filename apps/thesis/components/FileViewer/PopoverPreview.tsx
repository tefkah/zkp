import { Box, Text, Link } from '@chakra-ui/react'
import { useMemo } from 'react'
import useSWR from 'swr'
// import { ParsedOrg } from '../../services/thesis/parseOrg'
import { MDXRemote } from 'next-mdx-remote'
import { ChaoticOrbit } from '@uiball/loaders'
import { noteStyle } from '../NoteStyle'
import { createMdxRehypeReactCompents } from '../MDXComponents'

interface PopoverPreviewProps {
  href: string
  id: string
}

export const PopoverPreview = (props: PopoverPreviewProps) => {
  const { id, href } = props
  const { data, error } = useSWR(`/api/file/bySlug/${href}`)

  const comps = useMemo(() => createMdxRehypeReactCompents(id), [id])

  return (
    <Box w="100%" px={3} sx={noteStyle}>
      {
        // eslint-disable-next-line no-nested-ternary
        !data && !error ? (
          <ChaoticOrbit />
        ) : error ? (
          <Text>
            Something went wrong,{' '}
            <Link color="primary" href="https://github.com/thomasfkjorna/thesis-visualization">
              contact Thomas on Github
            </Link>
          </Text>
        ) : (
          <MDXRemote {...data.source} components={comps} />
          // <ParsedOrg type="popover" currentId={id!} text={data.file} />
        )
      }
    </Box>
  )
}

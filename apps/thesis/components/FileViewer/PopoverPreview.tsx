import { Box, Heading, Text, Spinner, Link } from '@chakra-ui/react'
import { useMemo } from 'react'
import useSWR from 'swr'
// import { ParsedOrg } from '../../services/thesis/parseOrg'
import { MDXRemote } from 'next-mdx-remote'
import { noteStyle } from '../NoteStyle'
import { createMdxRehypeReactCompents } from '../MDXComponents'
import { MDXProvider } from '@mdx-js/react'
import { deslugify } from '../../utils/slug'

interface PopoverPreviewProps {
  href: string
  title: string
  id: string
}

export const PopoverPreview = (props: PopoverPreviewProps) => {
  const { id, title, href } = props
  console.log({ href })
  const { data, error } = useSWR(`/api/file/bySlug/${href}`)

  const comps = useMemo(() => createMdxRehypeReactCompents(id), [id])

  return (
    <Box w="100%" px={3} sx={noteStyle}>
      <Heading size="md">{title}</Heading>
      {
        // eslint-disable-next-line no-nested-ternary
        !data && !error ? (
          <Spinner />
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

import { Box, Heading, VStack, useColorModeValue } from '@chakra-ui/react'
import { useMemo } from 'react'
// import { FilesData } from '../../utils/IDIndex/getFilesData'
import { slugify } from '../../utils/slug'
import { PreviewLink } from './Link'

interface Props {
  backLinks: string[]
  currentId: string
}

/**
 * TODO: Reimplement backlinks
 */
export const Backlinks = (props: Props) => {
  const { currentId, backLinks } = props

  const background = useColorModeValue('brand.50', 'brand.100')
  const links = useMemo(
    () =>
      backLinks.map((link) => {
        //        const title = data?.[link]?.title ?? ''
        console.log(link)
        const title = 'FIX THIS FIX THIS'
        return (
          <PreviewLink
            backlink
            currentId={currentId}
            key={title}
            // data={data}
            title={title}
            href={`/${slugify(title)}`}
          >
            {title}
          </PreviewLink>
        )
      }),
    [backLinks],
  )
  return (
    <div className="bg-brand-100 my-8 rounded-lg p-4">
      <h2 className="text-md text-red-700" color="brand.700">
        References to this note
      </h2>
      <VStack mt={4} spacing={4} alignItems="flex-start">
        {links}
      </VStack>
    </div>
  )
}

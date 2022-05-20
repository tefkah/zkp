import { useEffect } from 'react'
import { Box, Flex } from '@chakra-ui/react'
import { join } from 'path'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { GetStaticProps } from 'next'
import { readFile } from 'fs/promises'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'
// import { getFilesData, FilesData } from '../utils/IDIndex/getFilesData'
// import { OrgFileData } from '../utils/IDIndex/getDataFromFile'
// import { deslugify, slugify } from '../utils/slug'
import { Header } from '../components/Header'
// import { getTableOfContents } from '../utils/getTableOfContents'
// import { getListOfCommitsWithStats } from '../utils/getListOfCommitsWithStats'
// import { getHistoryForFile } from '../utils/getHistoryForFile'
import { Footer } from '../components/Footer'
// import { NoteScrollContainer } from '../components/FileViewer'
import { CommitPerDateLog, NoteHeading, DataBy } from '../types'
import { CustomSideBar } from '../components/CustomSidebar'
// import { postFilePaths } from '../utils/mdx/mdxUtils'
// import { mdxDataByName } from '../utils/mdx/mdxDataByName'
import { mdxSerialize } from '../utils/mdx/mdxSerialize'
import { BIB_PATH, DATA_DIR, NEXT_PUBLIC_NOTE_DIR } from '../utils/paths'
// import { createMdxRehypeReactCompents } from '../components/MDXComponents/mdxRehypeReactComponents'
// import { mdxDataBySlug } from '../utils/mdx/mdxDataBySlug'
import { NoteScrollContainer } from '../components/FileViewer'

/**
 * Props for the file page
 */
export type FilePageProps = {
  /**
   * The source for the current page
   */
  source: MDXRemoteSerializeResult
  /**
   * The metadata for the current file
   */
  // fileData: OrgFileData
  /**
   * Array with the ids of the stacked notes
   */
  stackedNotes?: string[]
  /**
   * Object containing all info of all files by id
   */
  id: string
  /**
   * Array of headings of the current document
   */
  toc: NoteHeading[]
  commits: CommitPerDateLog
}
export interface MDFilePageProps {
  source: MDXRemoteSerializeResult<Record<string, any>>
  name: string
  slug: string
  frontMatter: { [key: string]: any }
  // data: any
  fileList: DataBy
}

const useHeadingFocusOnRouteChange = () => {
  const router = useRouter()

  useEffect(() => {
    const onRouteChange = () => {
      const [heading] = Array.from(document.getElementsByTagName('h1'))
      heading?.focus()
    }
    router.events.on('routeChangeComplete', onRouteChange)
    return () => {
      router.events.off('routeChangeComplete', onRouteChange)
    }
  }, [router.events])
}

export const FilePage = (props: MDFilePageProps) => {
  // const { fileData, items } = props
  // const { title } = fileData
  //
  const { source, slug, name, frontMatter, fileList } = props

  const { title } = frontMatter

  useHeadingFocusOnRouteChange()

  return (
    <>
      <Head>
        <title>{`${title || name} | Thomas Thesis`}</title>
      </Head>

      <Box w="100vw" h="100vh" overflowX="hidden">
        <Flex h="full" w="100vw">
          <CustomSideBar fileList={fileList} />
          <Box h="full" flex="1 1 auto" overflow="hidden">
            <Header />
            <Box h="full" as="main">
              <NoteScrollContainer source={source} id={slug} toc={[]} commits={{}} />
            </Box>
          </Box>
        </Flex>
        <Footer />
      </Box>
    </>
  )
}
export default FilePage

export const getStaticPaths = async () => {
  // const getData = await fetch('/data/dataBySlug.json')
  const data = JSON.parse(await readFile(join(DATA_DIR, 'dataBySlug.json'), 'utf8')) as DataBy

  const paths = Object.values(data)
    // Remove file extensions for page paths
    .map((entry) => entry.slug)
    // Map the path into the static paths object required by Next.js
    .map((file) => ({ params: { file } }))

  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({
  params,
}): Promise<{ props: MDFilePageProps }> => {
  // console.log(params?.file)
  const file = (Array.isArray(params?.file) ? params?.file.join('/') : params?.file) ?? ''
  // const data = await mdxDataBySlug()
  const data = JSON.parse(await readFile(join(DATA_DIR, 'dataBySlug.json'), 'utf8')) as DataBy
  const { name } = data[file]

  //  console.log(file)
  const input = await readFile(join(NEXT_PUBLIC_NOTE_DIR, file), 'utf8')
  // console.log(input)
  const bibliography = join(BIB_PATH)

  const { frontMatter, source } = await mdxSerialize(input, bibliography)

  const props = {
    slug: file,
    name,
    source,
    frontMatter,
    fileList: data,
  }

  return {
    props,
  }
}

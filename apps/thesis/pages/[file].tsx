import { useEffect } from 'react'
import { Box, Flex } from '@chakra-ui/react'
import { join } from 'path'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { GetStaticProps } from 'next'
import { readFile } from 'fs/promises'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { DataBy, MDFilePageProps } from '../types'
import { CustomSideBar } from '../components/CustomSidebar'
import { mdxSerialize } from '../utils/mdx/mdxSerialize'
import { BIB_PATH, DATA_DIR, NEXT_PUBLIC_NOTE_DIR } from '../utils/paths'
import { NoteScrollContainer } from '../components/FileViewer/NoteScrollContainer'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  const { source, slug, name, frontMatter, fileList } = props

  const { title } = frontMatter

  //  useHeadingFocusOnRouteChange()

  return (
    <>
      <Head>
        <title>{`${title || name} | Thomas Thesis`}</title>
      </Head>

      <div className="h-[100vh] w-[100vw] overflow-x-hidden">
        <div className="flex h-full w-[100vw]">
          <CustomSideBar fileList={fileList} />
          <div className="h-full flex-auto overflow-hidden">
            <Header />
            <main className="h-full">
              <NoteScrollContainer source={source} id={slug} toc={[]} commits={{}} />
            </main>
          </div>
        </div>
        <Footer />
      </div>
    </>
  )
}
export default FilePage

export const getStaticPaths = async () => {
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
  const file = (Array.isArray(params?.file) ? params?.file.join('/') : params?.file) ?? ''
  const data = JSON.parse(await readFile(join(DATA_DIR, 'dataBySlug.json'), 'utf8')) as DataBy
  const { name } = data[file]

  const input = await readFile(join(NEXT_PUBLIC_NOTE_DIR, file), 'utf8')
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

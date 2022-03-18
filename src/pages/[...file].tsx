import { useEffect } from 'react'
import { Box, Flex } from '@chakra-ui/react'
import { join } from 'path'
import { CommitPerDateLog, CSLCitation } from '../lib/api'
import CustomSideBar from '../components/CustomSidebar'
import process from 'process'
import getFilesData, { FilesData } from '../utils/IDIndex/getFilesData'
import { OrgFileData } from '../utils/IDIndex/getDataFromFile'
import { deslugify, slugify } from '../utils/slug'
import Header from '../components/Header'
import Head from 'next/head'
import Footer from '../components/Footer'
import { useRouter } from 'next/router'
import { getTableOfContents } from '../utils/getTableOfContents'
import { getListOfCommitsWithStats } from '../utils/getListOfCommitsWithStats'
import getHistoryForFile from '../utils/getHistoryForFile'
import { NoteScrollContainer } from '../components/FileViewer/NoteScrollContainer'

export interface File {
  path: string
  type: 'file'
  id: string
}
export interface Files {
  files: File[]
  folders: { [key: string]: File[] }
}
export interface NoteHeading {
  level: string
  text: string
  id: string
}
/**
 * Props for the file page
 */
export type FilePageProps = {
  /* The text for the current page */
  page: string
  history: CommitPerDateLog
  items: Files
  /*  The metadata for the current file */
  fileData: OrgFileData
  /* Array with the ids of the stacked notes */
  stackedNotes?: string[]
  /*  Object containing all info of all files by id */
  data: FilesData
  slug: string
  /* Array of headings of the current document */
  toc: NoteHeading[]
  commits: CommitPerDateLog
  /* Array with the bibliography of the current note in CSL format */
  csl: CSLCitation[]
}

function useHeadingFocusOnRouteChange() {
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

export default function FilePage(props: FilePageProps) {
  const { fileData, items } = props
  const { title } = fileData

  useHeadingFocusOnRouteChange()

  return (
    <>
      <Head>
        <title>{`${title} | Thomas Thesis`}</title>
      </Head>

      <Box w="100vw" h="100vh" overflowX="hidden">
        <Flex minH="full" w="100vw">
          <CustomSideBar items={items} />
          <Box h="full" flex="1 1 auto" overflowX="hidden">
            <Header />
            <NoteScrollContainer {...props} />
          </Box>
        </Flex>
        <Footer />
      </Box>
    </>
  )
}

export async function getStaticPaths() {
  const data = await getFilesData()
  const fileList = Object.values(data).map((entry) => ({
    params: {
      file: [slugify(entry.title)],
    },
  }))
  return {
    paths: fileList,
    fallback: 'blocking',
  }
}

export interface StaticProps {
  params: { file: string[] }
}

export async function getStaticProps(props: StaticProps) {
  const fs = require('fs')
  // const { file } = props.params
  const cwd = process.cwd()
  const { dataWithoutDiffs } = await getListOfCommitsWithStats(
    '',
    '',
    join(cwd, 'notes'),
    join(cwd, 'notes', 'git'),
  )

  let data = {} as FilesData
  try {
    data = JSON.parse(await fs.promises.readFile(join(cwd, 'data', 'dataById.json'), 'utf8'))
  } catch (err) {
    console.warn('No existing filedata found, generating...')
    data = await getFilesData()
  }

  const slug = deslugify(props.params.file[0])
  const stackedNotes = props.params.file.slice(1)

  const file = Object.values(data).find((entry) => entry.title === slug)
  const concatFile = file?.path || ''

  const fileList = Object.entries(data).reduce(
    (acc: Files, curr: [id: string, entry: OrgFileData]) => {
      const [id, entry] = curr
      const { path: rawPath, title, tags } = entry
      const path = rawPath.split('/')
      if (path.length !== 1) {
        acc.folders[path[0]] = [...(acc.folders[path[0]] || []), { type: 'file', path: title, id }]
        return acc
      }
      if (tags?.includes('definition')) {
        acc.folders.Definitions = [
          ...(acc.folders.Definitions || []),
          { type: 'file', path: title, id },
        ]
        return acc
      }
      if (tags?.includes('reference')) {
        acc.folders['Literature Notes'] = [
          ...(acc.folders['Literature Notes'] || []),
          { type: 'file', path: title, id },
        ]
        return acc
      }
      acc.files.push({ type: 'file', path: title, id })
      return acc
    },
    { files: [], folders: {} },
  )

  const fileString = await fs.promises.readFile(join(cwd, 'notes', `${concatFile}`), {
    encoding: 'utf8',
  })

  // let orgTexts: { [key: string]: string } = {}

  // for (const link of linkFilePaths) {
  //   const [id, linkFilePath] = link
  //   const filepath = join(cwd, 'notes', `${linkFilePath}`)
  //   const file =
  //     linkFilePath && (await fs.promises.lstat(filepath)).isFile()
  //       ? await fs.promises.readFile(filepath, {
  //           encoding: 'utf8',
  //         })
  //       : ''
  //   orgTexts[id] = file
  // }

  // const commits = await tryReadJSON('data/git.json')
  const toc = [
    ...getTableOfContents(fileString),
    ...(file?.citations?.length
      ? [
          {
            text: 'References',
            id: 'references',
            level: 1,
          },
        ]
      : []),
  ]

  const commits = getHistoryForFile({ file: concatFile, commits: dataWithoutDiffs })

  const csl: CSLCitation[] = JSON.parse(
    await fs.promises.readFile(join(cwd, 'notes', 'bibliography', 'Academic.json'), {
      encoding: 'utf8',
    }),
  ).filter((entry: CSLCitation) => file?.citations?.includes(entry.id))

  return {
    props: {
      items: fileList,
      page: fileString,
      slug: slug,
      history: {},
      fileData: file,
      data,
      stackedNotes,
      // orgTexts,
      toc,
      commits,
      csl,
    },
    revalidate: 60,
  }
}

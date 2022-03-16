import {
  Text,
  Box,
  Container,
  Flex,
  Heading,
  IconButton,
  Tag,
  useDisclosure,
  VStack,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react'
import { join } from 'path'
import React, { ReactElement } from 'react'
import { CommitPerDateLog, CSLCitation } from '../lib/api'
import Sidebar from '../components/SideBar'
//import { OrgProcessor } from '../components/OrgProcessor'
import CustomSideBar from '../components/CustomSidebar'
import { HamburgerIcon } from '@chakra-ui/icons'
import process from 'process'
import getFilesData, { FilesData } from '../utils/IDIndex/getFilesData'
import { OrgFileData } from '../utils/IDIndex/getDataFromFile'
import { deslugify, slugify } from '../utils/slug'
import { format, parse } from 'date-fns'
import Link from 'next/link'
import { Backlinks } from '../components/FileViewer/Backlinks'
import { ProcessedOrg } from '../components/ProcessedOrg'
import Header from '../components/Header'
import Head from 'next/head'
import Footer from '../components/Footer'
import { useRouter } from 'next/router'
import TableOfContent from '../components/OutlineBox/TableOfContents'
import { getTableOfContents } from '../utils/getTableOfContents'
import { OutlineBox } from '../components/OutlineBox/OutlineBox'
import { getListOfCommitsWithStats } from '../utils/getListOfCommitsWithStats'
import getHistoryForFile from '../utils/getHistoryForFile'
import { parseTime } from '../utils/parseTime'
import { Citations } from '../components/FileViewer/Citations'
import { Giscus } from '@giscus/react'
import { CommentBox } from '../components/Comments/CommentBox'
import BasicLayout from '../components/Layouts/BasicLayout'
import { Note } from '../components/FileViewer/Note'

interface Props {
  page: string
  history: CommitPerDateLog
  items: Files
  fileData: OrgFileData
  data: FilesData
  slug: string
  // orgTexts: { [id: string]: string }
  toc: Heading[]
  commits: CommitPerDateLog
  csl: CSLCitation[]
}

function useHeadingFocusOnRouteChange() {
  const router = useRouter()

  React.useEffect(() => {
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

export interface Heading {
  level: string
  text: string
  id: string
}

export default function FilePage(props: Props) {
  const { toc, fileData, page, items, data, slug, commits, csl } = props
  const { title, tags, ctime, mtime, backLinks, citations, citation } = fileData

  useHeadingFocusOnRouteChange()

  const headings = toc

  return (
    <>
      <Head>
        <title>{`${title} | Thomas Thesis`}</title>
      </Head>

      <Box w="100vw" h="100vh" overflowX="hidden">
        <Flex minH="full">
          <CustomSideBar items={items} />
          <Box w="full">
            <Header />
            <Note {...{ toc, fileData, page, data, slug, commits, csl }} />
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

export interface File {
  path: string
  type: 'file'
}
export interface Files {
  files: File[]
  folders: { [key: string]: File[] }
}
export interface StaticProps {
  params: { file: string[] }
}

export async function getStaticProps(props: StaticProps) {
  const fs = require('fs')
  //const { file } = props.params
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

  const slug = deslugify(props.params.file.join(''))
  const file = Object.values(data).find((entry) => entry.title === slug)
  const concatFile = file?.path || ''

  const fileList = Object.entries(data).reduce(
    (acc: Files, curr: [id: string, entry: OrgFileData]) => {
      const [id, entry] = curr
      const { path: rawPath, title, tags } = entry
      const path = rawPath.split('/')
      if (path.length !== 1) {
        acc.folders[path[0]] = [...(acc.folders[path[0]] || []), { type: 'file', path: title }]
        return acc
      }
      if (tags?.includes('definition')) {
        acc.folders.Definitions = [
          ...(acc.folders.Definitions || []),
          { type: 'file', path: title },
        ]
        return acc
      }
      if (tags?.includes('reference')) {
        acc.folders['Literature Notes'] = [
          ...(acc.folders['Literature Notes'] || []),
          { type: 'file', path: title },
        ]
        return acc
      }
      acc.files.push({ type: 'file', path: title })
      return acc
    },
    { files: [], folders: {} },
  )

  const fileString = await fs.promises.readFile(join(cwd, 'notes', `${concatFile}`), {
    encoding: 'utf8',
  })

  const linkFilePaths = [...(file?.backLinks || []), ...(file?.forwardLinks || [])].map((link) => [
    link,
    data[link]?.path ?? '',
  ])

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

  //const commits = await tryReadJSON('data/git.json')
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
      // orgTexts,
      toc,
      commits,
      csl,
    },
    revalidate: 60,
  }
}

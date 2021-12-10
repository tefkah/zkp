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
} from '@chakra-ui/react'
import { join } from 'path'
import React from 'react'
import { CommitPerDateLog } from '../api'
import Header from '../components/Header'
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

interface Props {
  page: string
  history: CommitPerDateLog
  items: Files
  fileData: OrgFileData
  data: FilesData
  slug: string
  orgTexts: { [id: string]: string }
}

export default function FilePage(props: Props) {
  const { fileData, page, items, data, slug, orgTexts } = props
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { title, tags, ctime, mtime, backLinks } = fileData
  const parseTime = (time: string) => {
    const firstTime = parse(time.split(' ')[0], 'yyyyMMddHHmmss', new Date())
    return format(firstTime, "MMMM do, yyyy, 'at' HH:mm")
  }
  return (
    <>
      <Header />
      <Flex mt={12} width="full">
        {isOpen ? (
          <CustomSideBar {...{ onClose, isOpen }} items={items} />
        ) : (
          <IconButton
            left={5}
            top={14}
            position="fixed"
            variant="ghost"
            icon={<HamburgerIcon />}
            aria-label="open sidebar"
            onClick={onOpen}
          />
        )}
        <Container mt={4}>
          <Heading>{slug}</Heading>
          <HStack spacing={2}>
            {tags.map((tag: string) => (
              <Tag>{tag}</Tag>
            ))}{' '}
            n
          </HStack>
          <Text>Created on {parseTime(ctime)}</Text>
          <Text>Last modified {parseTime(mtime)}</Text>
          <ProcessedOrg text={page} data={{ data, orgTexts }} />
          {backLinks?.length && <Backlinks {...{ data: { data, orgTexts }, backLinks }} />}
        </Container>
      </Flex>
    </>
  )
}

export async function getStaticPaths() {
  const data = await getFilesData()
  Object.values(data).forEach((entry) => !entry.path && console.log(entry))
  const fileList = Object.entries(data).map((entry) => ({
    params: {
      file: [slugify(entry[1].title)],
    },
  }))
  //console.dir(fileList, { depth: null })
  return {
    paths: fileList,
    fallback: false,
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
  const data = await getFilesData()
  const slug = deslugify(props.params.file.join(''))
  const file = Object.values(data).find((entry) => entry.title === slug)
  console.log(file)
  const concatFile = file.path

  const cwd = process.cwd()
  const fileList = Object.entries(data).reduce(
    (acc: Files, curr: any) => {
      const [id, entry] = curr
      const { path: rawPath, title } = entry
      const path = rawPath.split('/')
      if (path.length === 1) {
        acc.files.push({ type: 'file', path: title })
        return acc
      }
      acc.folders[path[0]] = [...(acc.folders[path[0]] || []), { type: 'file', path: title }]
      return acc
    },
    { files: [], folders: {} },
  )
  const fileString = await fs.promises.readFile(join(cwd, 'notes', `${concatFile}`), {
    encoding: 'utf8',
  })
  const linkFilePaths = [...(file.backLinks || []), ...(file.forwardLinks || [])].map((link) => [
    link,
    data[link]?.path ?? '',
  ])

  let orgTexts: { [key: string]: string } = {}
  for (const link of linkFilePaths) {
    const [id, linkFilePath] = link
    const file = linkFilePath
      ? await fs.promises.readFile(join(cwd, 'notes', `${linkFilePath}`), {
          encoding: 'utf8',
        })
      : ''
    orgTexts[id] = file
  }

  //const commits = await tryReadJSON('data/git.json')

  return {
    props: {
      items: fileList,
      page: fileString,
      slug: slug,
      history: {},
      fileData: file,
      data,
      orgTexts,
    },
  }
}

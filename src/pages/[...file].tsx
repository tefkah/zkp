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
} from '@chakra-ui/react'
import { join } from 'path'
import React from 'react'
import { CommitPerDateLog } from '../api'
import Header from '../components/Header'
import Sidebar from '../components/SideBar'
import { OrgProcessor } from '../components/OrgProcessor'
import CustomSideBar from '../components/CustomSidebar'
import { HamburgerIcon } from '@chakra-ui/icons'
import process from 'process'
import getFilesData, { FilesData } from '../utils/IDIndex/getFilesData'
import { OrgFileData } from '../utils/IDIndex/getDataFromFile'
import { deslugify, slugify } from '../utils/slug'

interface Props {
  page: string
  history: CommitPerDateLog
  items: Files
  fileData: OrgFileData
  data: FilesData
  slug: string
}

export default function FilePage(props: Props) {
  const { fileData, page, items, data, slug } = props
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { title, tags, ctime, mtime } = fileData
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
          <Heading>{title}</Heading>
          {tags.map((tag: string) => (
            <Tag>{tag}</Tag>
          ))}
          <Text>Created at {ctime}</Text>
          <Text>Last modified {mtime}</Text>
          <OrgProcessor text={page} data={data} />
        </Container>
      </Flex>
    </>
  )
}

export async function getStaticPaths() {
  const cwd = process.cwd()

  const data = await getFilesData()
  const fileList = Object.keys(data).map((path) => ({
    params: {
      file: [slugify(path)],
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
  const file = data[deslugify(props.params.file.join(''))]
  const concatFile = file.path

  const cwd = process.cwd()
  const fileList = Object.entries(data).reduce(
    (acc: Files, curr: any) => {
      const [title, entry] = curr
      const { path: rawPath } = entry
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

  //const commits = await tryReadJSON('data/git.json')

  return {
    props: {
      items: fileList,
      page: fileString,
      slug: concatFile,
      history: {},
      fileData: file,
      data,
    },
  }
}

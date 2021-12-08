import { Box, Container, Flex, IconButton, useDisclosure, VStack } from '@chakra-ui/react'
import { join } from 'path'
import React from 'react'
import { CommitPerDateLog } from '../api'
import Header from '../components/Header'
import Sidebar from '../components/SideBar'
import fs from 'fs'
import { OrgProcessor } from '../components/OrgProcessor'
import CustomSideBar from '../components/CustomSidebar'
import { HamburgerIcon } from '@chakra-ui/icons'
import process from 'process'

interface Props {
  page: string
  history: CommitPerDateLog
  items: Files
}

export default function FilePage(props: Props) {
  const { page, items } = props
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Header />
      <Flex mt={12} width="full">
        {isOpen ? (
          <CustomSideBar {...{ onClose, isOpen, items }} />
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
          <OrgProcessor text={page} />
        </Container>
      </Flex>
    </>
  )
}

const getNotes = async () => {
  const cwd = process.cwd()
  return (await fs.promises.readdir(join(cwd, 'notes')))
    .filter((path) => path !== 'git' && path[0] !== '.')
    .flatMap((path) =>
      fs.lstatSync(join(cwd, 'notes', path)).isFile()
        ? [[path]]
        : fs.readdirSync(join(cwd, 'notes', path)).map((p) => [path, p]),
    )
}
export async function getStaticPaths() {
  const cwd = process.cwd()

  const notes = await getNotes()
  const fileList = notes.map((path) => ({
    params: {
      file: path,
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
  const { file } = props.params
  const concatFile = file.join('/')

  const cwd = process.cwd()
  const fileList = (await getNotes()).reduce(
    (acc: Files, path: string[]) => {
      if (path.length === 1) {
        acc.files.push({ type: 'file', path: path[0] })
        return acc
      }
      acc.folders[path[0]] = [...(acc.folders[path[0]] || []), { type: 'file', path: path[1] }]
      return acc
    },
    { files: [], folders: {} },
  )
  const fileString = await fs.promises.readFile(join(cwd, 'notes', `${concatFile}`), {
    encoding: 'utf8',
  })
  //const commits = await tryReadJSON('data/git.json')

  return { props: { items: fileList, page: fileString, history: {} } }
}

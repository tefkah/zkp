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

interface Props {
  page: string
  history: CommitPerDateLog
  items: string[]
}

export default function FilePage(props: Props) {
  const { page, items } = props
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Header />
      <Flex mt={20} width="full">
        {isOpen ? (
          <CustomSideBar {...{ onClose, isOpen, items }} />
        ) : (
          <IconButton
            left={5}
            position="absolute"
            variant="ghost"
            icon={<HamburgerIcon />}
            aria-label="open sidebar"
            onClick={onOpen}
          />
        )}
        <Container>
          <OrgProcessor text={page} />
        </Container>
      </Flex>
    </>
  )
}

export async function getStaticPaths() {
  const cwd = process.cwd()
  const fileList = await (await fs.promises.readdir(join(cwd, 'notes')))
    .filter((path) => path[0] !== '.')
    .map((path) => ({ params: { file: path.split('/') } }))

  //console.dir(fileList, { depth: null })
  return {
    paths: fileList,
    fallback: false,
  }
}

export interface StaticProps {
  params: { file: string[] }
}
export async function getStaticProps(props: StaticProps) {
  const { file } = props.params
  const concatFile = file.join('/')

  const cwd = process.cwd()

  const fileList = await fs.promises.readdir(join(cwd, 'notes'))
  const fileString = await fs.promises.readFile(join(cwd, 'notes', `${concatFile}`), {
    encoding: 'utf8',
  })
  //const commits = await tryReadJSON('data/git.json')

  return { props: { items: fileList, page: fileString, history: {} } }
}

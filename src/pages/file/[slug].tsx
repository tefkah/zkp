import { join } from 'path'
import { readdir, readFile } from 'fs/promises'
import React from 'react'
import { getCommits } from '../../utils/getListOfCommitsWithStats'
import { Container } from '@chakra-ui/react'
import { parseOrg } from '../../server/parseOrg'
import { noteStyle } from '../../components/NoteStyle'

interface Props {
  fileText: string
}

export default function File(props: Props) {
  const { fileText } = props
  const parsedText = parseOrg({ text: fileText })
  return <Container sx={{ ...noteStyle }}>{parsedText}</Container>
}

export async function getStaticPaths() {
  const cwd = process.cwd()
  const files = (await readdir(join(cwd, 'notes')))
    .filter((path) => !['git', '.github', '.gitignore'].includes(path))
    .map((path) => `/file/${path}`)
  return {
    paths: files,
    fallback: false,
  }
}

export interface StaticProps {
  params: { slug: string }
}
export async function getStaticProps(props: StaticProps) {
  const { slug } = props.params
  const cwd = process.cwd()
  const fileText = await readFile(join(cwd, 'notes', slug), { encoding: 'utf8' })

  return { props: { fileText } }
}

import { GetStaticPaths, GetStaticProps } from 'next'
import React from 'react'
import { AiOutlineConsoleSql } from 'react-icons/ai'
import { ProcessedOrg } from '../../components/ProcessedOrg'

export default function testfile(props: { processedFile: any }) {
  return <div>{props.processedFile}</div>
}

export const getStaticPaths: GetStaticPaths = async (ctx) => {
  const readdirp = require('readdirp')
  const { join } = require('path')
  const cwd = process.cwd()
  const files = await readdirp.promise(join(cwd, 'notes'), { type: 'files' })
  const paths = files.map(
    (file: { path: string; fullPath: string; basename: string; dirent: string }) =>
      `/test/${file.path.replace('.md', '')}`,
  )

  console.log(paths)
  return { paths: paths, fallback: false }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const fs = require('fs/promises')

  const { join } = require('path')
  const rawPath = ctx?.params?.file ?? ''
  const path = Array.isArray(rawPath) ? rawPath : ['', rawPath]

  const cwd = process.cwd()

  const filepath = join(cwd, 'notes', ...path) + '.md'
  console.log(filepath)
  const file = await fs.readFile(filepath, 'utf8')
  const processedFile = ProcessedOrg({
    text: file,
    currentId: '',
  })
  const fileString = renderToString(processedFile)

  return {
    props: {
      data: processedFile,
    },
  }
}

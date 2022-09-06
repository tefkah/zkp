import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'
import readdirp from 'readdirp'
import { DATA_DIR, NEXT_PUBLIC_NOTE_DIR } from '@zkp/paths'
import { slugify } from '@zkp/slugify'
import { DataBy } from '@zkp/types'
import { createReadStream } from 'fs'

export const getFreshDataBySlug = async (noteDir = NEXT_PUBLIC_NOTE_DIR) => {
  const rawDir = await readdirp.promise(noteDir, {
    alwaysStat: true,
    directoryFilter: ['!*/git', '!Archive', '!Components'], // '!.obsidian', '!.obsidian*'],
    fileFilter: ['!.*'], //, '!.obsidian*'],
  })
  // Only include md(x) files
  const data = rawDir.reduce((acc, curr) => {
    if (!/.mdx?$/.test(curr.basename)) return acc
    const name = curr.basename.replace(/\.mdx?$/, '')
    const slug = slugify(name)
    const { atime, mtime, ctime, birthtime, ...stats } = { ...curr.stats }
    if (/Archive/i.test(slug)) console.log(curr)
    acc[slug] = {
      // @ts-expect-error yeahyeah
      stats,
      fullPath: curr.fullPath,
      path: curr.path,
      name,
      slug,
      folders:
        curr.path
          .replace(curr.basename, '')
          .split('/')
          .filter((entry) => entry) ?? [],
      basename: curr.basename,
    }
    return acc
  }, {} as DataBy)

  return data
}

// TODO: Make the dataBy... files inherit from the same function
const mdxDataBySlug = async (
  dataDir = DATA_DIR,
  noteDir = NEXT_PUBLIC_NOTE_DIR,
): Promise<DataBy> => {
  // if (process.env.NODE === 'development') {
  //   const data = await getFreshDataBySlug(noteDir)
  //   return data
  // }
  const datapath = join(dataDir, 'dataBySlug.json')
  const data = await getFreshDataBySlug(noteDir)
  await writeFile(datapath, JSON.stringify(data))
  return data
}

export default mdxDataBySlug

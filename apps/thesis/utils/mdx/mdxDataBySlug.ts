import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'
import readdirp from 'readdirp'
import { DATA_DIR, NOTE_DIR } from '../paths'
import { slugify } from '../slug'
import { DataBy } from '../../types'

export const getFreshDataBySlug = async () => {
  const rawDir = await readdirp.promise(NOTE_DIR, { alwaysStat: true })
  // Only include md(x) files
  return rawDir
    .filter((entry) => /\.mdx?$/.test(entry.path))
    .reduce((acc, curr) => {
      const name = curr.basename.replace(/\.mdx?$/, '')
      const slug = slugify(name)
      const { atime, mtime, ctime, birthtime, ...stats } = { ...curr.stats }
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
}

// TODO: Make the dataBy... files inherit from the same function
export const mdxDataBySlug = async (): Promise<DataBy> => {
  if (process.env.ALWAYS_FRESH !== 'true') {
    const data = await getFreshDataBySlug()
    return data
  }
  const datapath = join(DATA_DIR, 'dataBySlug.json')
  try {
    const data = JSON.parse(await readFile(datapath, 'utf8'))
    return data
  } catch (e) {
    const data = await getFreshDataBySlug()
    await writeFile(datapath, JSON.stringify(data))
    return data
  }
}

import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'
import readdirp from 'readdirp'
import { DATA_DIR, NEXT_PUBLIC_NOTE_DIR } from '@zkp/paths'
import { slugify } from '@zkp/slugify'
import { DataBy } from '@zkp/types'

const mdxBacklinksBySlug = async ({}) => {
  const datapath = join(DATA_DIR, 'dataBySlug.json')
  try {
    const data: DataBy = JSON.parse(await readFile(datapath, 'utf8'))
    const readFiles = await Promise.all(
      Object.entries(data).map(async ([slug, data]) => {
        const file = await readFile(data.fullPath, 'utf8')
        const links = file
          .match(/\[\[(\w+?)(\]\]|\|)/g)
          ?.map((link) => link.replace(/\[\[|\]\]|\|/g, ''))
      }),
    )
  } catch (e) {}
}

export default mdxBacklinksBySlug

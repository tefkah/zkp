import readdirp from 'readdirp'
import { NOTE_DIR } from '../paths'
import { slugify } from '../slug'

export const mdxDataByName = async () =>
  (await readdirp.promise(NOTE_DIR))
    // Only include md(x) files
    .filter((entry) => /\.mdx?$/.test(entry.path))
    .reduce((acc, curr) => {
      const name = curr.basename.replace(/\.mdx?/, '').toLowerCase()
      acc[name] = { path: curr.path, name, slug: slugify(name) }
      return acc
    }, {} as { [name: string]: { name: string; path: string; slug: string } })

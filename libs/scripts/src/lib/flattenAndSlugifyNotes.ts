import { readFile, writeFile, rename, rmdir, unlink } from 'fs/promises'
import { extname, join } from 'path'
import readdirp from 'readdirp'
import { NEXT_PUBLIC_NOTE_DIR } from '@zkp/paths'
import { slugify } from '@zkp/slugify'

export const flattenAndSlugifyNotes = async ({ notedir = NEXT_PUBLIC_NOTE_DIR }) => {
  try {
    const removedObsidian = await unlink(join(notedir, '.obsidian'))
    const removedObsidianVim = await unlink(join(notedir, '.obsidian.vimrc'))
    const removedObsidianChapter = await unlink(join(notedir, 'Chapters', '.obsidian'))
    const removedObsidianChapterVim = await unlink(join(notedir, 'Chapters', '.obsidian.vimrc'))
  } catch (e) {
    console.log(e)
  }
  const files = await readdirp.promise(notedir, {
    fileFilter: ['*.md', '*.mdx', '*.png', '*.jpg', '*.svg', '!.obsidian*'],
    directoryFilter: ['!*/git', '!Archive', '!Components', '!.obsidian'],
  })

  const renamedFiles = []

  for (const file of files) {
    const ending = file.basename.replace(/(\.md|\.org|\.mdx)/, '')
    const sluggedEnding = slugify(ending)
    const newpath = join(notedir, sluggedEnding)
    renamedFiles.push(rename(file.fullPath, newpath))
  }

  await Promise.all(renamedFiles)
  console.log('Done flattening and slugifying!')
}

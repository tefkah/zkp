import { slugify } from '@zkp/slugify'
import { Backlinks, DataBy } from '@zkp/types'
import { readFile } from 'fs/promises'
import { join } from 'path'
import readdirp from 'readdirp'
import { getAllLinkedTexts } from './getAllLinkedTexts'

export const findAllBacklinks = async ({
  directory,
  mdxData,
}: {
  directory: string
  mdxData: DataBy
}): Promise<Backlinks> => {
  // const files = await readdirp.promise(directory, {
  //   fileFilter: ['!*.*', '!.*', '!git*', '!.obsidian*'],
  //   directoryFilter: ['!git', '!Archive', '!Components', '!.obsidian'],
  // })
  const files = Object.values(mdxData)

  const linkRegex = /\[\[(.*?)(\|.*?)?\]\]/g

  const forwardLinks = await Promise.all(
    files.map(async (file) => {
      const { basename, path } = file
      const links = await getAllLinkedTexts(join(directory, path))

      return {
        slug: basename,
        links,
      }
    }),
  )

  const backlinks = Object.values(forwardLinks).reduce((acc, forwardLink) => {
    for (const link of forwardLink.links) {
      const slug = slugify(link.name)
      if (!acc[slug]) {
        acc[slug] = []
      }
      acc[slug].push(forwardLink.slug)
    }
    return acc
  }, {} as { [slug: string]: string[] })

  const backlinks2 = Object.fromEntries<
    { link: string; sentences?: string[]; slug: string; name?: string }[]
  >(
    await Promise.all(
      Object.entries(backlinks).map(async ([slug, links]) => {
        const sentences = await Promise.all(
          links.map(async (link) => {
            const text = await readFile(join(directory, link), 'utf8')

            const rawsentences = text.match(new RegExp(`^.*?${linkRegex.source}.*?$`, 'gm'))
            const sentences = rawsentences?.filter((sentence) => {
              const s = sentence.replace(linkRegex, (_s, one) => `${slugify(one)}`)
              // console.log(s)
              return s.includes(slug)
            })

            return {
              link: slug,
              // text,
              sentences,

              slug: link,
              name: text.match(/^#.*?$/gm)?.[0]?.replace(/^# ?/, ''),
            }
          }),
        )
        return [slug, sentences] as const
      }),
    ),
  )
  console.log(backlinks2)

  return backlinks2
}

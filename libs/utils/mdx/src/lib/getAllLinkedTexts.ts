import { readFile } from 'fs/promises'
import { join, dirname, extname } from 'path'
import { slugify } from '@zkp/slugify'
import readdirp from 'readdirp'

const regex = /\[\[(.*?)(\|.*?)?\]\]/g
/**
 * Returns an array of all linked texts in the given MDX file
 * @param path The path to the MDX file
 */
export const getAllLinkedTextLinks = async (text: string) => {
  const matches = text.replace(/## Backlinks.*/gims, '').match(regex) || []
  return matches.map((match) => match.replace(regex, '$1'))
}

/**
 * Finds all linked texts in the given MDX file and then reads them from the same path as the mdx file
 * and returns them as an array of objects with the following properties:
 * - name: The name of the linked text
 * - text: The text of the linked text
 *
 * @param path The path to the MDX file
 */
export const getAllLinkedTexts = async (path: string) => {
  const content = await readFile(path, 'utf-8')
  const links = await getAllLinkedTextLinks(content)
  const texts = await Promise.all(
    links.map(async (link) => {
      const textPath = join(dirname(path), slugify(link))
      try {
        const text = await readFile(textPath, 'utf-8')
        return {
          name: link,
          text,
        }
      } catch (e) {
        return {
          name: link,
          text: '',
        }
      }
    }),
  )
  return texts
}

/**
 * Create an object of all files in a folder and the texts that link to it
 */
export const getAllBacklinks = async (directory: string) => {
  const files = await readdirp.promise(directory, {
    fileFilter: ['!*.*', '!.*', '!git*', '!.obsidian*'],
    directoryFilter: ['!git', '!Archive', '!Components', '!.obsidian'],
  })

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

  /**
   * Invert the forward links to create a backlinks
   */
  const backlinks = []
  for (const forwardLink of forwardLinks) {
    const mappedLinks = await Promise.all(
      forwardLink.links.map(async (link) => {
        const slug = slugify(link.name)

        const yeah = await getRelevantBacklinkPassages(forwardLink.slug, link.text)
        return { slug, sentence: yeah, name: link.name }

        // acc[slug].push(file.slug)
      }),
    )

    backlinks.push([forwardLink.slug, mappedLinks])
  }
  const backlinks2 = Object.fromEntries(await Promise.all(backlinks))
  return backlinks2
}

/**
 * Find the sentence where `link` is found in `text`.
 *
 * Find all the sentences in with occurences of new RegExp(`\[\[${(slugify(link)})(\|.*?)?\]\]`,'gm') in `text`
 */

export const getRelevantBacklinkPassages = async (link: string, text: string) => {
  const sentences = text.match(/^.*?\[\[.*?(\|.*?)?\]\].*?$/gm)!
  const relevantSentence = sentences
    ?.filter((sentence) => {
      return sentence.includes(`[[${slugify(link)}`)
    })?.[0]
    ?.replace(regex, '$1')

  return relevantSentence
}

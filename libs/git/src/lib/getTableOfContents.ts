import slugger from 'github-slugger'
import { NoteHeading } from '@zkp/types'

// see https://github.com/hashicorp/next-mdx-remote/issues/53#issuecomment-725906664
export const getTableOfContents = (orgContent: string) => {
  const regexp = /^(\*\*\* |\*\* |\* )(.*)\n/gm
  const headings = [...orgContent.matchAll(regexp)]
  let tableOfContents: NoteHeading[] = []

  if (headings.length) {
    tableOfContents = headings.map((heading) => {
      const headingText = heading[2].trim().replace(/\[\[\.*?\]\]/g, '')
      const headingType = `h${heading[1].trim().length + 1}`
      const headingLink = slugger.slug(headingText, false)

      return {
        text: headingText,
        id: headingLink,
        level: headingType,
      }
    })
  }

  return tableOfContents
}

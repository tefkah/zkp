import slugger from 'github-slugger'
import { Heading } from '../pages/[...file]'

//see https://github.com/hashicorp/next-mdx-remote/issues/53#issuecomment-725906664
export function getTableOfContents(orgContent: string) {
  const regexp = new RegExp(/^(\*\*\* |\*\* |\* )(.*)\n/, 'gm')
  // @ts-ignore
  const headings = [...orgContent.matchAll(regexp)]
  let tableOfContents: Heading[] = []

  if (headings.length) {
    tableOfContents = headings.map((heading) => {
      const headingText = heading[2].trim().replace(/\[\[\.*?\]\]/g, '')
      console.log(heading[2])
      console.log(heading[1])
      const headingType: string = `h${heading[1].trim().length + 1}`
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

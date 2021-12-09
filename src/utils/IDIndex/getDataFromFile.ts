import unified from 'unified'
import uniorgParse from 'uniorg-parse'
import { readOrgFile } from './readOrgFile'
import { visitIds } from 'orgast-util-visit-ids'
import { Keyword, NodeProperty, OrgData, PropertyDrawer } from 'uniorg'
import visit from 'unist-util-visit'
import { extractKeywords } from 'uniorg-extract-keywords'
import { AiOutlineConsoleSql } from 'react-icons/ai'

export interface DataProps {}
export interface OrgFileData {
  path: string
  id: string
  tags: any
  ctime: string
  mtime: string
  citation: string
  title: any
}

export const getDataFromFile = async (text: string, props?: DataProps) => {
  let data = {} as OrgFileData
  const processor = unified()
    .use(uniorgParse)
    .use(extractKeywords, { name: 'keywords' })
    .use(
      () => (tree) =>
        visitIds(tree as OrgData, (id, node) => {
          if (data.id) return
          data.id = id
        }),
    )
    .use(() => (node) => {
      visit(node, 'property-drawer', (drawer: PropertyDrawer) => {
        const kids = drawer.children

        kids.forEach((kid: NodeProperty) => {
          const { key, value } = kid
          switch (key) {
            case 'ctime':
              data.ctime = value
              return
            case 'mtime':
              data.mtime = value
              return
            case 'ROAM_REFS':
              data.citation = value
              return
            default:
              return
          }
        })
      })
      visit(node, 'keyword', (keyword: Keyword) => {
        const { key, value } = keyword
        switch (key.toLowerCase()) {
          case 'title':
            data.title = value
            return
          case 'filetags':
            data.tags = value.split(' ')
            return
          default:
            return
        }
      })
    })

  const tree = processor.parse(text)
  await processor.run(tree)
  const { title, ...rest } = data
  return [title, rest]
}

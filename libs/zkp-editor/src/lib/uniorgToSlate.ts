import * as slate from './slate'
import * as uniorg from 'uniorg'

export type Decoration = {
  [key in (
    | uniorg.Italic
    | uniorg.Bold
    | uniorg.Code
    | uniorg.Verbatim
    | uniorg.StrikeThrough
    | uniorg.Underline
    | uniorg.Superscript
    | uniorg.Subscript
  )['type']]?: true
}

const defaultOptions: OrgToSlateOptions = {
  imageFilenameExtensions: [
    'png',
    'jpeg',
    'jpg',
    'gif',
    'tiff',
    'tif',
    'xbm',
    'xpm',
    'pbm',
    'pgm',
    'ppm',
    'pnm',
    'svg',
  ],
  useSections: false,
  footnotesSection: (footnotes) => [
    { type: 'headline', level: 1, children: [{ text: 'Footnotes' }] },
    ...footnotes,
  ],
}
export interface OrgToSlateOptions {
  imageFilenameExtensions: string[]
  /**
   * Whether to wrap org sections into <section>.
   */
  useSections: boolean
  /**
   * A function to wrap footnotes. First argument of the function is
   * an array of all footnote definitions and the function should
   * return a new Hast node to be appended to the document.
   *
   * Roughly corresponds to `org-html-footnotes-section`.
   *
   * Default is:
   * ```
   * <h1>Footnotes:</h1>
   * {...footnotes}
   * ```
   */
  footnotesSection: (footnotes: Node[]) => Array<Node | SlateNode>
}

// `org-html-html5-elements`
const html5Elements = new Set([
  'article',
  'aside',
  'audio',
  'canvas',
  'details',
  'figcaption',
  'figure',
  'footer',
  'header',
  'menu',
  'meter',
  'nav',
  'output',
  'progress',
  'section',
  'summary',
  'video',
])

export function uniorgToSlate(
  node: uniorg.OrgData,
  opts: Partial<OrgToSlateOptions> = {},
): slate.Node[] {
  return createSlateRoot(node)
}

function createSlateRoot(root: uniorg.OrgData): slate.Node[] {
  return convertNodes(root.children, {})
}

function convertNodes(nodes: uniorg.OrgNode[], deco: Decoration): slate.Node[] {
  if (nodes.length === 0) {
    return [{ text: '' }]
  }

  return nodes.reduce<slate.Node[]>((acc, node) => {
    acc.push(...createSlateNode(node, deco))
    return acc
  }, [])
}

function createSlateNode(node: uniorg.OrgNode, deco: Decoration): SlateNode[] {
  switch (node.type) {
    // case 'org-data':
    //   return [{ type: 'root', children: convertNodes(node.children, deco) }]
    case 'paragraph':
      return [createParagraph(node, deco)]
    case 'section':
      return [createSection(node, deco)]
    case 'headline':
      return [createHeadline(node, deco)]
    case 'quote-block':
      return [createBlockquote(node, deco)]
    case 'comment-block':
      return [createCommentBlock(node, deco)]
    case 'example-block':
      return [createExampleBlock(node, deco)]
    case 'special-block':
      return [createSpecialBlock(node, deco)]
    case 'export-block':
      return [createExportBlock(node, deco)]
    case 'src-block':
      return [createSrcBlock(node, deco)]
    case 'plain-list':
      return [createList(node, deco)]
    case 'list-item':
      return [createListItem(node, deco)]
    case 'table':
      return [createTable(node, deco)]
    case 'table-row':
      return [createTableRow(node, deco)]
    case 'table-cell':
      return [createTableCell(node, deco)]
    case 'code':
      return [createCode(node)]
    case 'footnote-definition':
      return [createFootnoteDefinition(node, deco)]
    case 'verbatim':
    case 'text':
      return [createText(node.value, deco)]
    case 'italic':
    case 'bold':
    case 'underline':
    case 'superscript':
    case 'subscript':
    case 'strike-through': {
      const { type, children } = node
      return children.reduce<SlateNode[]>((acc, n) => {
        acc.push(...createSlateNode(n, { ...deco, [type]: true }))
        return acc
      }, [])
    }
    case 'code': {
      const { type, value } = node
      return [createText(value, { ...deco, [type]: true })]
    }
    case 'link':
      return [createLink(node, deco)]
    case 'footnote-reference':
      return [createFootnoteReference(node)]
    case 'latex-environment':
      return [createMath(node)]
    case 'latex-fragment':
      return [createInlineMath(node)]
    default:
      const _: never = node as never
      break
  }
  return []
}

export type Paragraph = ReturnType<typeof createParagraph>

function createParagraph(node: uniorg.Paragraph, deco: Decoration) {
  const { type, children } = node
  return {
    type,
    children: convertNodes(children as uniorg.OrgNode[], deco),
  }
}

export type Section = ReturnType<typeof createSection>

function createSection(node: uniorg.Section, deco: Decoration) {
  const { type, children } = node
  return {
    type,
    children: convertNodes(children, deco),
  }
}

export type Heading = ReturnType<typeof createHeadline>

function createHeadline(node: uniorg.Headline, deco: Decoration) {
  const { type, children, level } = node
  if (level === 15) console.log(children)
  return {
    type,
    level,
    children: children.length === 0 ? [{ text: '', deco }] : convertNodes(children, deco),
  }
}

export type Blockquote = ReturnType<typeof createBlockquote>

function createBlockquote(node: uniorg.QuoteBlock, deco: Decoration) {
  return {
    type: node.type,
    children: convertNodes(node.children, deco),
  }
}

export type List = ReturnType<typeof createList>

function createList(node: uniorg.List, deco: Decoration) {
  const { type, children, listType } = node
  if (listType === 'unordered') {
    return { type: 'unorderedList', children: convertNodes(children, deco) }
  } else if (listType === 'ordered') {
    return { type: 'orderedList', children: convertNodes(children, deco) }
  } else {
    return { type: 'definitionList', children: convertNodes(children, deco) }
  }
}

export type ListItem = ReturnType<typeof createListItem>

function createListItem(node: uniorg.ListItem, deco: Decoration) {
  const { type, children } = node
  return {
    type,
    children: convertNodes(children, deco),
  }
}

export type Table = ReturnType<typeof createTable>

function createTable(node: uniorg.Table, deco: Decoration) {
  // table.el tables are not supported for export
  if (node.tableType === 'table.el') {
    return { type: 'pre', children: [{ text: node.value }] }
  }
  const { type, tableType, children, tblfm } = node

  // TODO: support column groups
  // see https://orgmode.org/manual/Column-Groups.html

  const table = { type: 'table', children: <slate.Node[]>[] }

  let hasHead = false
  let group: uniorg.TableRow[] = []
  children.forEach((r) => {
    if (r.rowType === 'rule') {
      // rule finishes the group
      if (!hasHead) {
        table.children.push({
          type: 'tableHead',
          children: group.map((row: uniorg.TableRow) => ({
            type: 'tableRow',
            children: row.children.map((cell) => ({
              type: 'th',
              children: convertNodes([cell], deco),
            })),
          })),
        })
        hasHead = true
      } else {
        table.children.push({ type: 'tableBody', children: convertNodes(group, deco) })
      }
      group = []
    }

    group.push(r)
  })

  if (group.length) {
    table.children.push({ type: 'tableBody', children: convertNodes(group, deco) })
  }

  return table
}

export type TableRow = ReturnType<typeof createTableRow>

function createTableRow(node: uniorg.TableRow, deco: Decoration) {
  const { type, children } = node
  return {
    type: 'tableRow',
    children: convertNodes(children, deco),
  }
}

export type TableCell = ReturnType<typeof createTableCell>

function createTableCell(node: uniorg.TableCell, deco: Decoration) {
  const { type, children } = node
  return {
    type: 'tableCell',
    children: convertNodes(children, deco),
  }
}

export type Code = ReturnType<typeof createCode>

function createCode(node: uniorg.Code) {
  const { type, value } = node
  return {
    type,
    children: [{ text: value }],
  }
}

export type SrcBlock = ReturnType<typeof createSrcBlock>

function createSrcBlock(node: uniorg.SrcBlock, deco: Decoration) {
  const { type, value, language } = node
  return {
    type,
    language,
    children: [{ text: value }],
  }
}

export type CommentBlock = ReturnType<typeof createSrcBlock>

function createCommentBlock(node: uniorg.CommentBlock, deco: Decoration) {
  const { type, value } = node
  return {
    type,
    children: [{ text: value }],
  }
}
export type ExampleBlock = ReturnType<typeof createSrcBlock>

function createExampleBlock(node: uniorg.ExampleBlock, deco: Decoration) {
  const { type, value } = node
  return {
    type,
    children: [{ text: value }],
  }
}
export type VerseBlock = ReturnType<typeof createVerseBlock>

function createVerseBlock(node: uniorg.VerseBlock, deco: Decoration) {
  const { type, children } = node
  return {
    type,
    children: convertNodes(children, deco),
  }
}
export type ExportBlock = ReturnType<typeof createExportBlock>

function createExportBlock(node: uniorg.ExportBlock, deco: Decoration) {
  const { type, value, backend } = node
  return {
    type,
    backend,
    children: [{ text: value }],
  }
}

export type SpecialBlock = ReturnType<typeof createSpecialBlock>
function createSpecialBlock(node: uniorg.SpecialBlock, deco: Decoration) {
  const { type, blockType, children } = node
  return {
    type,
    blockType,
    children: convertNodes(children, deco),
  }
}

export type Math = ReturnType<typeof createMath>

function createMath(node: uniorg.LatexEnvironment) {
  const { type, value } = node
  return {
    type,
    children: [{ text: value }],
  }
}

export type InlineMath = ReturnType<typeof createInlineMath>

function createInlineMath(node: uniorg.LatexFragment) {
  const { type, value } = node
  return {
    type,
    children: [{ text: value }],
  }
}

export type FootnoteDefinition = ReturnType<typeof createFootnoteDefinition>

function createFootnoteDefinition(node: uniorg.FootnoteDefinition, deco: Decoration) {
  const { type, children, label } = node
  return {
    type,
    children: convertNodes(children, deco),
    label,
  }
}

export type Text = ReturnType<typeof createText>

function createText(text: string, deco: Decoration) {
  return {
    ...deco,
    text,
  }
}

export type Link = ReturnType<typeof createLink>

function createLink(node: uniorg.Link, deco: Decoration) {
  const { type, children, path, linkType, rawLink: link } = node

  const imageRe = new RegExp(`\.(${defaultOptions.imageFilenameExtensions.join('|')})$`)
  if (link.match(imageRe)) {
    // TODO: set alt
    return { type: 'image', src: link, children: [{ text: '' }] }
  }
  return {
    type: 'link',
    href: link,
    children: children.length ? convertNodes(children, deco) : [{ text: link }],
  }
}

//export type Image = ReturnType<typeof createImage>

// function createImage(node: uniorg.Image) {
//   const { type, url, title, alt } = node
//   return {
//     type,
//     url,
//     title,
//     alt,
//     children: [{ text: '' }],
//   }
// }

//export type LinkReference = ReturnType<typeof createLinkReference>

// function createLinkReference(node: uniorg.LinkReference, deco: Decoration) {
//   const { type, children, referenceType, identifier, label } = node
//   return {
//     type,
//     children: convertNodes(children, deco),
//     referenceType,
//     identifier,
//     label,
//   }
// }

// export type ImageReference = ReturnType<typeof createImageReference>

// function createImageReference(node: uniorg.ImageReference) {
//   const { type, alt, referenceType, identifier, label } = node
//   return {
//     type,
//     alt,
//     referenceType,
//     identifier,
//     label,
//     children: [{ text: '' }],
//   }
// }

export type FootnoteReference = ReturnType<typeof createFootnoteReference>

function createFootnoteReference(node: uniorg.FootnoteReference) {
  const { type, label } = node
  return {
    type,
    label,
    children: [{ text: '' }],
  }
}

export type SlateNode =
  | Paragraph
  | Heading
  | Blockquote
  | List
  | ListItem
  | Table
  | TableRow
  | TableCell
  | Code
  | FootnoteDefinition
  | Text
  | Link
  | FootnoteReference
  | Math
  | InlineMath
  | SrcBlock
  | ExampleBlock
  | VerseBlock
  | ExampleBlock
  | CommentBlock
  | SpecialBlock

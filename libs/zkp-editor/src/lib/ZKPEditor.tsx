import React, { useState, useCallback, useMemo } from 'react'
import { BaseEditor, NodeEntry, Node, BaseRange, Selection } from 'slate'
import { Slate, Editable, withReact, ReactEditor, RenderLeafProps } from 'slate-react'
import { Text, Descendant, createEditor } from 'slate'
import { HistoryEditor, withHistory } from 'slate-history'
import { renderElement } from './renderElement'
import { SlateMarkdownElement, SlateNodes, SlateText } from './types'
import { toggleFormat } from './toggleFormat'

// import { Icon, Toolbar } from '../components'
// This example is for an Editor with `ReactEditor` and `HistoryEditor`
type CustomElement = { type: 'paragraph'; children: CustomText[] }
type CustomText = { text: string; bold?: true; highlight?: true }
export type FormattedText = { text: string; bold?: true }
declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor
    Element: SlateMarkdownElement
    Text: SlateText
  }
}
import { mdxSlate } from './mdx/mdxToSlate'
import { ViewListIcon } from '@heroicons/react/solid'
import { HoveringToolbar } from './HoveringToolbar'
import { Leaf } from './Leaf'

export const SearchHighlightingExample = ({
  text,
  rawText,
}: {
  text: Descendant[]
  rawText: string
}) => {
  const [search, setSearch] = useState<string | undefined>()
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])

  const decorate = useCallback(
    ([node, path]: NodeEntry<Node>) => {
      const ranges: BaseRange[] = []

      if (search && Text.isText(node)) {
        const { text } = node
        const parts = text.split(search)
        let offset = 0

        parts.forEach((part, i) => {
          if (i !== 0) {
            ranges.push({
              anchor: { path, offset: offset - search.length },
              focus: { path, offset },
              highlight: true,
            })
          }

          offset = offset + part.length + search.length
        })
      }

      return ranges
    },
    [search],
  )

  return (
    <Slate editor={editor} value={text}>
      <div className="prose relative">
        <input
          type="search"
          placeholder="Search the text..."
          onChange={(e) => {
            console.log(e)
            setSearch(e.target.value)
          }}
          className="prose w-full pl-10"
        />
      </div>
      <HoveringToolbar />
      <Editable
        className="prose"
        decorate={decorate}
        renderElement={renderElement}
        renderLeaf={(props) => <Leaf {...props} />}
        // onDOMBeforeInput={(event: InputEvent) => {
        //   event.preventDefault()
        //   switch (event.inputType) {
        //     case 'formatBold':
        //       return toggleFormat(editor, 'bold')
        //     case 'formatItalic':
        //       return toggleFormat(editor, 'italic')
        //     case 'formatUnderline':
        //       return toggleFormat(editor, 'underline')
        //   }
        // }}
      />
    </Slate>
  )
}

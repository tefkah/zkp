import React, { useState, useCallback, useMemo } from 'react'
import { BaseEditor, NodeEntry, Node, BaseRange, Editor, Transforms } from 'slate'
import { Slate, Editable, withReact, ReactEditor } from 'slate-react'
import { Text, Descendant, createEditor, Range } from 'slate'
import { HistoryEditor, withHistory } from 'slate-history'
import { renderElement } from '../../renderElement'
import { SlateMarkdownElement, SlateNodes, SlateText } from '../../types'

export type FormattedText = { text: string; bold?: true }
declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor
    Element: SlateMarkdownElement
    Text: SlateText
  }
}

import { HoveringToolbar } from '../../HoveringToolbar'
import { Leaf } from '../../Leaf'
import { parseMd } from '../../transformers/md/parseMd'
import { mdSlate } from '../../transformers/md/mdToSlate'
import { insertText } from '@udecode/plate'

export interface TinyEditorProps {
  text: Descendant[]
  rawText: string
}

export const TinyEditor = ({ text, rawText }: TinyEditorProps) => {
  // const [search, setSearch] = useState<string | undefined>()
  const editor = useMemo(() => withMarkdown(withHistory(withReact(createEditor()))), [])

  const decorate = useCallback(([node, path]: NodeEntry<Node>) => {
    const ranges: BaseRange[] = []
  }, [])

  return (
    <Slate editor={editor} value={text}>
      <Editable
        className="prose"
        //        decorate={decorate}
        renderElement={renderElement}
        renderLeaf={(props) => <Leaf {...props} />}
      />
    </Slate>
  )
}

function withMarkdown(editor: BaseEditor & ReactEditor & HistoryEditor) {
  //const {} = editor

  const { insertText } = editor

  editor.insertText = (text) => {
    for (const [node, path] of Editor.nodes(editor)) {
      if (!Text.isText(node)) continue

      const newNode = mdSlate(node.text)
      const newNodes = newNode[0]?.children

      console.log(newNodes)
      if (newNodes?.length > 1 || newNodes?.[0]?.type) {
        console.log(newNodes)
        Transforms.delete(editor, { at: path })
        Transforms.insertNodes(editor, newNodes, { at: path })
      }
    }
    // if (text === ' ' && selection && Range.isCollapsed(selection)) { const { anchor } = selection
    //   const block = Editor.above(editor, {
    //     match: n => Editor.isBlock(editor, n),
    //   })
    //   const path = block ? block[1] : []
    //   const start = Editor.start(editor, path)
    //   const range = { anchor, focus: start }
    //   const beforeText = Editor.string(editor, range)
    //   const type = SHORTCUTS[beforeText]

    //   if (type) {
    //     Transforms.select(editor, range)
    //     Transforms.delete(editor)
    //     const newProperties: Partial<SlateElement> = {
    //       type,
    //     }
    //     Transforms.setNodes<SlateElement>(editor, newProperties, {
    //       match: n => Editor.isBlock(editor, n),
    //     })

    //     Transforms.splitNodes()
    //     }

    //     return
    //   }
    // }

    insertText(text)
  }

  return editor
}
function parseSlate(value: Descendant[]) {
  console.log(value)
  for (const node of value) {
  }
}

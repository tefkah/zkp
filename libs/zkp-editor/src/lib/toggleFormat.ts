import { Editor, Transforms, Text } from 'slate'

export const toggleFormat = (editor: Editor, format: 'bold' | 'italic' | 'underline') => {
  const isActive = isFormatActive(editor, format)
  Transforms.setNodes(
    editor,
    { [format]: isActive ? null : true },
    { match: Text.isText, split: true },
  )
}

export const isFormatActive = (editor: Editor, format: 'bold' | 'italic' | 'underline') => {
  const [match] = Editor.nodes(editor, {
    match: (n) => n[format] === true,
    mode: 'all',
  })
  return !!match
}

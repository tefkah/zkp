import {
  Plate,
  usePlateEditorRef,
  getPluginType,
  createPlugins,
  createBoldPlugin,
  createItalicPlugin,
  createUnderlinePlugin,
} from '@udecode/plate'
import { BalloonToolbar, MarkToolbarButton } from '@udecode/plate-ui-toolbar'
import { Descendant } from 'slate'

const BallonToolbarMarks = () => {
  const editor = usePlateEditorRef()

  const arrow = false
  const theme = 'dark'
  const popperOptions = {
    placement: 'top',
  }
  const tooltip = {
    arrow: true,
    delay: 0,
    duration: [200, 0],
    hideOnClick: false,
    offset: [0, 17],
    placement: 'top',
  }

  return (
    <BalloonToolbar popperOptions={popperOptions} theme={theme} arrow={arrow}>
      <MarkToolbarButton
        type={getPluginType(editor, 'bold')}
        // icon={<FormatBold />}
        tooltip={{ content: 'Bold (⌘B)', ...tooltip }}
      />
      <MarkToolbarButton
        type={getPluginType(editor, 'italic')}
        // icon={<FormatItalic />}
        tooltip={{ content: 'Italic (⌘I)', ...tooltip }}
      />
      <MarkToolbarButton
        type={getPluginType(editor, 'underline')}
        // icon={<FormatUnderlined />}
        tooltip={{ content: 'Underline (⌘U)', ...tooltip }}
      />
    </BalloonToolbar>
  )
}
const createElement = (text: Descendant[], { type = 'paragraph', mark } = {}) => {
  const leaf = { text }
  if (mark) {
    leaf[mark] = true
  }

  return {
    type,
    children: [leaf],
  }
}
export const PlateEditor = ({ initialValue }: { initialValue: Descendant[] }) => {
  const plugins = createPlugins([
    createBoldPlugin(), // bold mark
    createItalicPlugin(), // italic mark
    createUnderlinePlugin(),
  ])
  return (
    <Plate
      id="balloon-toolbar"
      plugins={plugins}
      // editableProps={CONFIG.editableProps}
      initialValue={initialValue}
    >
      <BallonToolbarMarks />
    </Plate>
  )
}

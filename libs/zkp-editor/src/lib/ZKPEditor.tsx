import React, { useState, useCallback, useMemo } from 'react'
import {
  Slate,
  Editable,
  withReact,
  RenderElementProps,
  RenderLeafProps,
  ReactEditor,
} from 'slate-react'
import { Text, Node, Descendant, createEditor, Editor, BaseElement, BaseEditor } from 'slate'
import { HistoryEditor, withHistory } from 'slate-history'

import { SearchIcon } from '@chakra-ui/icons'
import {
  Text as ChakraText,
  Box,
  Input,
  Heading,
  OrderedList,
  ListItem,
  UnorderedList,
} from '@chakra-ui/react'
import parseOrg from 'uniorg-parse'
import orgToSlate from './uniorgToSlatePlugin'
import unified from 'unified'
import { SlateMarkdownElement, SlateMarkdownLeaf, SlateNodes } from '@zkp/types'

// type CustomElement = { type: 'paragraph'; children: CustomText[] }
// type CustomText = { text: string; bold?: true }

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor
    Element: SlateMarkdownElement
    Text: SlateMarkdownLeaf
  }
}

export const SearchHighlightingExample = ({ text }: { text: SlateNodes[] }) => {
  const [value, setValue] = useState<Descendant[]>(text)
  //console.dir(value, { depth: 5 })
  const [search, setSearch] = useState<string | undefined>()
  const [editor] = useState(withReact(withHistory(createEditor())))
  Editor.normalize(editor, { force: true })
  const renderElement = useCallback((props) => <Element {...props} />, [])

  return (
    <Slate editor={editor} value={value} onChange={(value) => setValue(value)}>
      <Box position="relative">
        <SearchIcon
          {...{
            position: 'absolute',
            top: '0.3em',
            left: '0.4em',
            color: '#ccc',
          }}
        />
        <Input
          type="search"
          placeholder="Search the text..."
          onChange={(e) => setSearch(e.target.value)}
          paddingLeft="2.5em"
          width="100%"
        />
      </Box>
      <Editable
        //decorate={decorate}
        renderElement={renderElement}
        renderLeaf={(props) => <Leaf {...props} />}
      />
    </Slate>
  )
}

const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  return (
    <ChakraText
      as="span"
      {...attributes}
      {...(leaf.highlight && { 'data-cy': 'search-highlighted' })}
      fontWeight={leaf.strong ? 'bold' : undefined}
      fontStyle={leaf.emphasis ? 'italic' : undefined}
      // fontFamily={leaf.verbatim ? 'monospace' : undefined}
      backgroundColor={leaf.highlight ? '#ffeeba' : undefined}
    >
      {children}
    </ChakraText>
  )
}

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [
      {
        text: 'This is editable text that you can search. As you search, it looks for matching strings of text, and adds ',
      },
      { text: 'decorations', strong: true },
      { text: ' to them in realtime.' },
    ],
  },
  {
    type: 'paragraph',
    children: [{ text: 'Try it out for yourself by typing in the search box above!' }],
  },
]

const Element = ({ attributes, children, element }: RenderElementProps) => {
  if (element.children.length === 0) return null
  switch (element.type) {
    case 'blockquote':
      return <blockquote {...attributes}>{children}</blockquote>
    case 'list':
      return <ul {...attributes}>{children}</ul>
    case 'heading':
      return (
        <Heading
          variant="org"
          size={['lg', 'md', 'sm', 'xs', '2xs'][Math.min(4, element.depth - 1)]}
          as={element.depth > 7 ? 'h6' : `h${element.depth}`}
          {...attributes}
        >
          {children}
        </Heading>
      )
    case 'listItem':
      return <ListItem {...attributes}>{children}</ListItem>
    case 'list': {
      if (element.ordered) {
        return <OrderedList {...attributes}>{children}</OrderedList>
      }
      return <UnorderedList {...attributes}>{children}</UnorderedList>
    }
    default:
      return (
        <ChakraText variant="org" {...attributes}>
          {children}
        </ChakraText>
      )
  }
}

// export default SearchHighlightingExample

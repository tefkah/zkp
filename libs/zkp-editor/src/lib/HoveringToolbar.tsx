import { MouseEventHandler, MutableRefObject, useCallback, useEffect, useMemo, useRef } from 'react'
import { ReactEditor, useFocused, useSelected, useSlate, useSlateStatic } from 'slate-react'
import { useWindowScroll } from '@mantine/hooks'
import { nanoid } from 'nanoid'

import {
  AiOutlineComment,
  AiOutlineConsoleSql,
  AiOutlineStrikethrough,
  AiOutlineUnderline,
} from 'react-icons/ai'

export const HoveringToolbar = () => {
  // const ref = useRef<HTMLDivElement | null>()
  const editor = useSlate()
  const [scroll] = useWindowScroll()
  //  const inFocus = useFocused()

  // useEffect(() => {
  //   const el = ref.current
  //   const { selection } = editor

  //   if (!el) {
  //     return
  //   }

  //   if (
  //     !selection ||
  //     !inFocus ||
  //     Range.isCollapsed(selection) ||
  //     Editor.string(editor, selection) === ''
  //   ) {
  //     el.removeAttribute('style')
  //     return
  //   }

  //   const domSelection = window.getSelection()
  //   const domRange = domSelection.getRangeAt(0)
  //   const rect = domRange.getBoundingClientRect()
  //   el.style.opacity = '1'
  //   el.style.top = `${rect.top + window.pageYOffset - el.offsetHeight}px`
  //   el.style.left = `${rect.left + window.pageXOffset - el.offsetWidth / 2 + rect.width / 2}px`
  // })

  const domSelection = useMemo(
    () => (editor.selection ? ReactEditor.toDOMRange(editor, editor.selection) : null),
    [editor.selection],
  )

  const boundingClient = useMemo(
    () => domSelection?.getBoundingClientRect(),
    [domSelection, scroll],
  )

  const handleComment: MouseEventHandler<HTMLButtonElement> = useCallback((event) => {
    const button = event.currentTarget
    const id = nanoid()
    editor.addMark('comment', id)
    console.log(id)

    const point = { path: [0, 0], offset: 0 }
    editor.selection = null

    // ReactEditor.blur(editor)
  }, [])

  if (!editor.selection || !boundingClient || editor.selection.anchor === editor.selection.focus)
    return null

  const { x, y, bottom, top, left, right, height, width } = boundingClient

  // const makeGoodPosition: (ref: any, float: any) => Middleware = (ref: any, float: any) => ({
  //   name: 'makeGoodPosition',
  //   options: { ref, float },
  //   fn: async ({ x: flo, y: fly }) => {
  //     console.log(x, y, flo, fly)
  //     return {
  //       x: x,
  //       y: y,
  //     }
  //   },
  // })

  // const middleware: (refs: {
  //   referenceEl: MutableRefObject<Element | VirtualElement | null>
  //   floatingEl: MutableRefObject<HTMLElement | null>
  // }) => Middleware[] = ({ referenceEl, floatingEl }) => [makeGoodPosition(referenceEl, floatingEl)]

  const button = `inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:bg-indigo-400`

  return (
    <div
      // enter="transition ease-out duration-200"
      // enterFrom="opacity-0 translate-y-8"
      // enterTo="opacity-100 translate-y-0"
      // leave="transition ease-in duration-150"
      // leaveFrom="opacity-100 translate-y-0"
      // leaveTo="opacity-0 translate-y-8"
      // placement="bottom-start"
      // offset={15}
      // shift={6}
      // flip={1}
      // arrow
      // portal
      // ref={ref}
      // className="absolute -top-96 -left-96 z-10 mt-3 rounded-md bg-slate-500 py-[8px] pl-[7px] pr-[6px] opacity-0 transition-opacity"
      // {css`
      //   padding: 8px 7px 6px;
      //   position: absolute;
      //   z-index: 1;
      //   top: -10000px;
      //   left: -10000px;
      //   margin-top: -6px;
      //   opacity: 0;
      //   background-color: #222;
      //   border-radius: 4px;
      //   transition: opacity 0.75s;
      // `}
      onMouseDown={(e) => {
        // prevent toolbar from taking focus away from editor
        e.preventDefault()
      }}
      //className=""

      className="min-w-md h-sm z-10 flex justify-between rounded-md bg-indigo-100 p-2 transition-transform"
      style={{ position: 'fixed', transform: `translate(${left}px,${top}px)` }}
    >
      <button onClick={handleComment} title="Comment" tabIndex={0} className={button} type="button">
        <AiOutlineComment />
      </button>
      <button title="Strikethrough" tabIndex={0} className={button} type="button">
        <AiOutlineStrikethrough />
      </button>
      <button
        title="Underline"
        onClick={() => editor.addMark('bold', true)}
        className={button}
        tabIndex={0}
        type="button"
      >
        <AiOutlineUnderline />
      </button>
    </div>
  )
}

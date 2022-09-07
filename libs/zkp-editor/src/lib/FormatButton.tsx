import { useSlate } from 'slate-react'
import { isFormatActive, toggleFormat } from './toggleFormat'

export const FormatButton = ({
  format,
  icon,
}: {
  format: 'bold' | 'italic' | 'underline'
  icon: any
}) => {
  const editor = useSlate()
  return (
    <button
      className={`${isFormatActive(editor, format) ? 'bg-slate-200' : 'bg-slate-500'}}`}
      onClick={() => toggleFormat(editor, format)}
    >
      {format}
    </button>
  )
}

import { DotsVerticalIcon } from '@heroicons/react/solid'
import { Popover } from '@zkp/popover'
import { Button } from '@zkp/ui'

/* eslint-disable-next-line */
export interface EditMenuProps {
  canEdit?: boolean
  handleEdit?: () => void
  canDelete?: boolean //
  handleDelete?: () => void
  canMinimize?: boolean //
  handleMinimize?: () => void
  canReply?: boolean //
  handleReply?: () => void
  canMark?: boolean
  handleMark?: () => void
}

export const EditMenu = (props: EditMenuProps) => {
  const {
    canEdit,
    handleEdit,
    canMark,
    handleMark,
    canMinimize,
    handleMinimize,
    canReply,
    handleReply,
    canDelete,
    handleDelete,
  } = props
  console.log(props)
  if (!(canEdit || canDelete || canMinimize || canReply || canMark)) return null

  const btn = 'p-2 hover:bg-slate-200 dark:slate-600 w-full'
  return (
    <Popover
      placement="bottom-end"
      button={{ children: <DotsVerticalIcon />, className: 'h-6 w-4 text-slate-600' }}
    >
      <div className="w-40 bg-white dark:bg-slate-700">
        <ul>
          {canEdit && handleEdit && (
            <li>
              <button className={btn} onClick={handleEdit}>
                Edit
              </button>
            </li>
          )}
          {canReply && handleReply && (
            <li>
              <button className={btn} onClick={handleReply}>
                Quote reply
              </button>
            </li>
          )}
          {canMinimize && handleMinimize && (
            <li>
              <button className={btn} onClick={handleMinimize}>
                Minimize
              </button>
            </li>
          )}
          {canMark && handleMark && (
            <li>
              <button className={btn} onClick={handleMark}>
                Mark as answered
              </button>
            </li>
          )}
          {canDelete && handleDelete && (
            <li>
              <button className={btn} onClick={handleDelete}>
                Delete
              </button>
            </li>
          )}
        </ul>
      </div>
    </Popover>
  )
}

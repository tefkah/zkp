import { Float } from 'headlessui-float-react'
import { useState } from 'react'

interface CommentTextInterface {
  children: React.ReactNode
}

export const CommentText = (props: CommentTextInterface) => {
  const [open, setOpen] = useState(false)
  return (
    <Float
      as="span"
      strategy="absolute"
      enter="transition ease-out duration-200"
      enterFrom="opacity-0 translate-y-8"
      enterTo="opacity-100 translate-y-0"
      leave="transition ease-in duration-150"
      leaveFrom="opacity-100 translate-y-0"
      leaveTo="opacity-0 translate-y-8"
      placement="top-start"
      offset={15}
      shift={6}
      flip={1}
      // arrow={arrow}
      portal
      show={open}
    >
      <span
        onClick={() => setOpen((open) => !open)}
        onMouseEnter={() => setOpen((open) => true)}
        onMouseLeave={() => setOpen((open) => false)}
        className={`cursor-pointer rounded-md bg-yellow-100 transition-colors hover:bg-yellow-300`}
      >
        {props.children}
      </span>
      <div className="max-h-lg max-w-md overflow-y-scroll rounded-lg p-4 shadow-lg ring-1 ring-black ring-opacity-5">
        Ayy it's ya boy
      </div>
    </Float>
  )
}

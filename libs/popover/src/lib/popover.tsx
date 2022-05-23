import { Popover as HeadlessPopover, Transition } from '@headlessui/react'
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/solid'
import { Fragment, useState, useRef, ReactNode } from 'react'
import { Float } from 'headlessui-float-react'
import Link from 'next/link'

export interface PopoverProps {
  href?: string
  hover?: boolean
  title: string
  children: ReactNode
  arrow?: boolean
}

export const Popover = (props: PopoverProps) => {
  const { href, hover, title, children, arrow } = props
  const [show, setShow] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const open = () => {
    if (timer.current !== null) {
      clearTimeout(timer.current)
      timer.current = null
    }
    setShow(true)
  }

  const close = () => {
    setShow(false)
  }

  const delayClose = () => {
    timer.current = setTimeout(() => {
      setShow(false)
    }, 150)
  }

  return (
    <div
      // className="fixed top-16 max-w-sm px-4"
      className="relative"
    >
      <HeadlessPopover className="relative">
        <Float
          strategy="fixed"
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-8"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-8"
          placement="bottom-start"
          offset={15}
          shift={6}
          flip={1}
          arrow={arrow}
          portal
          show={show}
        >
          {/* <Link
            href={href ?? '#'}
            passHref
            // onClick={(e) => e.preventDefault()}
            // ref={buttonRef}
          > */}
          <span
            onMouseEnter={open}
            onMouseLeave={delayClose}
            className={`
                ${show ? '' : 'text-opacity-90'}
                group inline-flex items-center rounded-md text-base font-medium text-orange-300 text-white hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
          >
            <Link href={href ?? '#'} passHref>
              <a>{title}</a>
            </Link>
            <ChevronDownIcon
              className={`${show ? '' : 'text-opacity-70'}
                  ml-2 h-5 w-5 text-orange-300 transition duration-150 ease-in-out group-hover:text-opacity-80`}
              aria-hidden="true"
            />
          </span>
          {/* </Link> */}
          <HeadlessPopover.Panel
            onMouseEnter={open}
            onMouseLeave={delayClose}
            //  className="absolute left-1/2 z-10 mt-3 w-screen max-w-sm -translate-x-1/2 transform px-4 sm:px-0 lg:max-w-3xl"
          >
            {arrow && (
              <Float.Arrow className="absolute h-5 w-5 rotate-45 border border-gray-200 bg-white " />
            )}
            <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
              {children}
            </div>
          </HeadlessPopover.Panel>
        </Float>
      </HeadlessPopover>
    </div>
  )
}

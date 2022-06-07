import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/solid'
import {
  useState,
  useRef,
  ReactNode,
  DetailedHTMLProps,
  ButtonHTMLAttributes,
  HTMLAttributes,
} from 'react'
import { Float, FloatProps } from 'headlessui-float-react'
import Link from 'next/link'
import { twMerge } from 'tailwind-merge'

export interface PopoverPropsBase {
  href?: string
  hover?: boolean
  placement?: FloatProps['placement']
  children: ReactNode
  arrow?: boolean
  chevron?: boolean
  lazy?: boolean
  autoPlacement?: boolean
  portal?: boolean
}

export interface PopoverPropsButton extends PopoverPropsBase {
  button: DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
  span?: undefined
  title?: undefined
}
export interface PopoverPropsSpan extends PopoverPropsBase {
  title: string | React.ReactElement
  span?: DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>
  button?: undefined
}

export type PopoverProps = PopoverPropsSpan | PopoverPropsButton

export const Popover = (props: PopoverProps) => {
  const {
    span,
    href,
    autoPlacement,
    button,
    placement,
    portal,
    hover,
    chevron,
    title,
    children,
    arrow,
    lazy,
  } = props
  const [show, setShow] = useState(false)
  // const [shouldRender, setShouldRender] = useState(!lazy)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const open = () => {
    if (timer.current !== null) {
      clearTimeout(timer.current)
      timer.current = null
    }

    // if (!shouldRender) {
    //   console.log("I'm going to render the children")
    //   setShouldRender(true)
    // }

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

  const toggle = () => {
    setShow(!show)
  }

  return (
    // <span className="relative inline-flex">
    <Float
      as="span"
      strategy="fixed"
      enter="transition ease-out duration-200"
      enterFrom="opacity-0 translate-y-15"
      enterTo="opacity-100 translate-y-0"
      leave="transition ease-in duration-15"
      leaveFrom="opacity-100 translate-y-0"
      leaveTo="opacity-0 translate-y-8"
      placement={placement || 'bottom-start'}
      offset={15}
      shift={6}
      // flip={1}
      {...(autoPlacement ? { autoPlacement: true } : { flip: 1 })}
      arrow={arrow}
      portal={portal ?? true}
      show={show}
    >
      {button ? (
        <button
          {...(hover ? { onMouseEnter: open, onMouseLeave: delayClose } : {})}
          {...button}
          onClick={toggle}
          type="button"
          aria-label={button['aria-label']}
          className={button.className ?? ``}
        />
      ) : span ? (
        <span
          onMouseEnter={open}
          onMouseLeave={delayClose}
          className={twMerge(
            `
                ${show ? '' : 'text-opacity-90'}
                group inline-flex items-center rounded-md text-base font-medium  hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`,
            span.className,
          )}
        >
          {span.children}
        </span>
      ) : (
        <span
          onMouseEnter={open}
          onMouseLeave={delayClose}
          className={`
                ${show ? '' : 'text-opacity-90'}
                group inline-flex items-center rounded-md text-base font-medium  hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
        >
          <Link href={href ?? '#'} passHref>
            <a>{title}</a>
          </Link>
          {chevron && (
            <ChevronDownIcon
              className={`${show ? '' : 'text-opacity-70'}
                  ml-2 h-5 w-5 text-orange-300 transition duration-150 ease-in-out group-hover:text-opacity-80`}
              aria-hidden="true"
            />
          )}
        </span>
      )}
      <span
        onMouseEnter={open}
        onMouseLeave={delayClose}
        className="relative z-50"
        //  className="absolute left-1/2 z-10 mt-3 w-screen max-w-sm -translate-x-1/2 transform px-4 sm:px-0 lg:max-w-3xl"
      >
        {arrow && (
          <Float.Arrow /> //className="absolute h-5 w-5 rotate-45 border border-gray-200 bg-white " />
        )}
        <div className="max-h-lg h-80 max-w-sm overflow-y-scroll rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
          {children}
        </div>
      </span>
    </Float>
    // </span>
  )
}

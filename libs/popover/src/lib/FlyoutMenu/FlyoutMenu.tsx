import { Fragment, useRef } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/solid'
// import Link from "@/components/Link"
import Link from 'next/link'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

/// <reference types="next" />
/// <reference types="next/types/global" />
declare module '*.svg' {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>
  export default content
}

/**
 * Recursive navigation menu type
 *
 * @typeParam title - The title of the link to display in the nav menu.
 * @typeParam href_or_submenu - The actual href (absolute URL) for a link,
 *                              OR another NAVIGATION_MENU (a submenu).
 *
 * @remarks
 * This type expects an array of tuples, where each array has a "title"
 * for the navigation menu that either points to a link or submenu. The
 * link ("href") is a plain string. The submenu is this type, recursively.
 *
 * Reference:
 * https://www.typescriptlang.org/play#example/recursive-type-references
 *
 */
type NAVIGATION_MENU_TYPE =
  | [title: string, href_or_submenu: string | NAVIGATION_MENU_TYPE | NAVIGATION_MENU_TYPE[]]
  | NAVIGATION_MENU_TYPE[]

export const FlyoutMenu = ({
  title,
  hrefOrSubmenu,
  layout,
}: {
  title: string
  hrefOrSubmenu: NAVIGATION_MENU_TYPE
  layout: 'outer' | 'inner'
}) => {
  const timeoutDuration = 200
  let timeout: NodeJS.Timeout
  const useHover = true
  const buttonRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const toggleMenu = () => buttonRef?.current?.click()
  /*let closeMenu = () =>
    dropdownRef?.current?.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Escape",
        bubbles: true,
        cancelable: true,
      })
    )*/
  const onMouseHover = (open: boolean) => {
    clearTimeout(timeout)
    open && (timeout = setTimeout(() => toggleMenu(), timeoutDuration))
  }

  /* py-5 px-1 */
  const LINK_STYLES = classNames(
    'p-5 text-base text-gray-900 uppercase transition duration-150 ease-in-out hover:text-blue-800 w-full font-bold',
  )

  return (
    <Popover className="relative">
      {({ open }) => (
        <div
          onMouseEnter={() => useHover && onMouseHover(!open)}
          onMouseLeave={() => useHover && onMouseHover(open)}
        >
          <Popover.Button
            className={classNames(
              open ? 'text-blue-800' : 'text-gray-800',
              'inline-flex items-center rounded-md bg-white',
              LINK_STYLES,
            )}
            ref={buttonRef}
          >
            <span className="uppercase">{title}</span>
            {layout === 'outer' && (
              <ChevronDownIcon
                className={classNames(
                  open ? 'translate-y-1.5 text-gray-600' : 'text-gray-400',
                  'ml-2 h-5 w-5 transform transition-all',
                )}
                aria-hidden="true"
              />
            )}
            {layout === 'inner' && (
              <ChevronRightIcon
                className={classNames(
                  open ? 'translate-x-4 text-gray-600' : 'text-gray-400',
                  'ml-2 h-5 w-5 transform transition-all group-hover:text-gray-500',
                )}
                aria-hidden="true"
              />
            )}
          </Popover.Button>

          <Transition
            show={open}
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel
              static
              className={classNames(
                (layout === 'inner' && 'absolute top-0 left-44 z-10 w-64') as string,
                (layout === 'outer' && 'absolute left-[-1.75rem] z-10 mt-2 w-64 px-2') as string,
              )}
              ref={dropdownRef}
            >
              <div
                className={classNames(
                  (layout === 'inner' &&
                    'relative top-[-4px] grid space-y-[2.5px] divide-y-2 rounded-md border-2 border-solid border-blue-800 bg-white') as string,
                  (layout === 'outer' &&
                    'relative grid space-y-[2px] divide-y-2 rounded-md border-2 border-solid border-gray-300 bg-white') as string,
                )}
              >
                {typeof hrefOrSubmenu === 'string' && (
                  <Link key={title + hrefOrSubmenu} href={hrefOrSubmenu} passHref>
                    <a className={LINK_STYLES}>{title}</a>
                  </Link>
                )}
                {typeof hrefOrSubmenu === 'object' &&
                  (hrefOrSubmenu as NAVIGATION_MENU_TYPE[]).map(
                    ([title, hrefOrSubmenu]: NAVIGATION_MENU_TYPE) => {
                      const href = typeof hrefOrSubmenu === 'string' ? hrefOrSubmenu : undefined
                      const submenu = typeof hrefOrSubmenu === 'object' ? hrefOrSubmenu : undefined
                      return (
                        <>
                          {href && (
                            <Link key={title + href} href={href} passHref>
                              <a className={LINK_STYLES}>{title}</a>
                            </Link>
                          )}
                          {submenu && (
                            <Popover.Group>
                              <FlyoutMenu
                                title={title as string}
                                hrefOrSubmenu={submenu}
                                layout="inner"
                              />
                            </Popover.Group>
                          )}
                        </>
                      )
                    },
                  )}
              </div>
            </Popover.Panel>
          </Transition>
        </div>
      )}
    </Popover>
  )
}

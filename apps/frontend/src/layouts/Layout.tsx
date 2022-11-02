import { XIcon } from '@primer/octicons-react'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <>
      <Head>
        <title>ZKP</title>
        <meta name="description" content="ZKP" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="relative bg-white dark:bg-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex justify-between items-center border-b-2 border-gray-100 py-6 md:justify-start md:space-x-10">
              <div className="flex justify-start lg:w-0 lg:flex-1">
                <Link href="/">
                  <a>
                    <span className="sr-only">Workflow</span>
                    <img
                      className="h-8 w-auto sm:h-10"
                      src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                      alt=""
                    />
                  </a>
                </Link>
              </div>
              <div className="-mr-2 -my-2 md:hidden">
                <button
                  onClick={toggleMenu}
                  type="button"
                  className="bg-white dark:bg-slate-800 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                  aria-expanded="false"
                >
                  <span className="sr-only">Open menu</span>
                  {/* <MenuIcon className="h-6 w-6" aria-hidden="true" /> */}
                </button>
              </div>
              <nav className="hidden md:flex space-x-10">
                <Link href="/">
                  <a className="text-base font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white">
                    Home
                  </a>
                </Link>
                <Link href="/notes">
                  <a className="text-base font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white">
                    Notes
                  </a>
                </Link>
                <Link href="/about">
                  <a className="text-base font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white">
                    About
                  </a>
                </Link>
                <Link href="/contact">
                  <a className="text-base font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white">
                    Contact
                  </a>
                </Link>
              </nav>
            </div>
          </div>

          <div
            className={`${
              isMenuOpen ? '' : 'hidden'
            } absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden`}
          >
            <div className="rounded-lg shadow-md bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 overflow-hidden">
              <div className="px-5 pt-4 flex items-center justify-between">
                <div>
                  <img
                    className="h-8 w-auto"
                    src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                    alt=""
                  />
                </div>
                <div className="-mr-2">
                  <button
                    onClick={closeMenu}
                    type="button"
                    className="bg-white dark:bg-slate-800 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                  >
                    <span className="sr-only">Close menu</span>
                    <XIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
              </div>
              <div role="menu" aria-orientation="vertical" aria-labelledby="main-menu">
                <div className="px-2 pt-2 pb-3 space-y-1" role="none">
                  <Link href="/">
                    <a
                      role="menuitem"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-slate-700"
                    >
                      Home
                    </a>
                  </Link>
                  <Link href="/notes">
                    <a
                      role="menuitem"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-slate-700"
                    >
                      Notes
                    </a>
                  </Link>
                  <Link href="/about">
                    <a
                      role="menuitem"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-slate-700"
                    >
                      About
                    </a>
                  </Link>
                  <Link href="/contact">
                    <a
                      role="menuitem"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-slate-700"
                    >
                      Contact
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <main>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <div className="border-4 border-dashed border-gray-200 rounded-lg h-96">
                {children}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

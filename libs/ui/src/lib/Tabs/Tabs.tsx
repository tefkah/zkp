export interface TabsProps {
  categories: Category
}
export interface Category {
  Recent: Recent[]
  Popular: Recent[]
  Trending: Recent[]
}

interface Recent {
  id: number
  title: string
  date: string
  commentCount: number
  shareCount: number
}

import { Fragment, useState } from 'react'
import { Tab, Transition } from '@headlessui/react'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export const Tabs = ({ categories: cats }: TabsProps) => {
  let [categories] = useState(cats)

  return (
    <div className="w-full max-w-md px-2 py-16 sm:px-0">
      <Tab.Group>
        {({ selectedIndex }) => (
          <>
            <Tab.List className="relative flex space-x-1 rounded-xl bg-slate-100 p-1">
              {Object.keys(categories).map((category, index) => (
                <Tab
                  key={category}
                  className={({ selected }) => {
                    return classNames(
                      'relative w-full rounded-lg bg-transparent py-2.5  text-sm font-medium leading-5 transition-colors focus:outline-none focus:outline-hidden',
                      selected ? 'text-blue-600' : 'text-slate-600',
                      // selected
                      //   ? 'bg-white shadow'
                      //   : 'text-blue-100 hover:bg-white/[0.12] hover:text-white',
                    )
                  }}
                >
                  <span className="relative z-10">{category}</span>
                </Tab>
              ))}
              <div
                className={classNames(
                  'absolute left-0 min-h-[80%] rounded-xl bg-white shadow-md transition-transform duration-150 ease-in',
                  ' border-2 border-blue-300 ',
                )}
                style={{
                  transitionTimingFunction: 'cubic-bezier(0.42, 0.0, 1.0, 1.0)',
                  transform: `translate(${100 * selectedIndex}%,0)`,
                  width: `${100 / (Object.keys(categories).length ?? 1)}%`,
                }}
              ></div>
            </Tab.List>
            {/* <Tab.Panels className="mt-2">
              {Object.values(categories).map((posts: Category[keyof Category], idx) => (
                <Tab.Panel
                  key={idx}
                  className={classNames(
                    'rounded-xl bg-white p-3',
                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                  )}
                >
                  <ul>
                    {posts.map((post) => (
                      <li key={post.id} className="relative rounded-md p-3 hover:bg-gray-100">
                        <h3 className="text-sm font-medium leading-5">{post.title}</h3>

                        <ul className="mt-1 flex space-x-1 text-xs font-normal leading-4 text-gray-500">
                          <li>{post.date}</li>
                          <li>&middot;</li>
                          <li>{post.commentCount} comments</li>
                          <li>&middot;</li>
                          <li>{post.shareCount} shares</li>
                        </ul>

                        <a
                          href="#"
                          className={classNames(
                            'absolute inset-0 rounded-md',
                            'ring-blue-400 focus:z-10 focus:outline-none focus:ring-2',
                          )}
                        />
                      </li>
                    ))}
                  </ul>
                </Tab.Panel>
              ))}
            </Tab.Panels> */}
          </>
        )}
      </Tab.Group>
    </div>
  )
}

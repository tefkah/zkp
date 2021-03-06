import * as React from 'react'

export const useScrollSpy = (selectors: string[], options?: IntersectionObserverInit) => {
  const [activeId, setActiveId] = React.useState<string>()
  const observer = React.useRef<IntersectionObserver | null>(null)
  React.useEffect(() => {
    const elements = selectors.map((selector) => document.querySelector(selector))
    observer.current?.disconnect()
    observer.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry?.isIntersecting) {
          // TODO: scrollspy can't decide between two candidates.
          // @ts-expect-error this does not work for some reason
          setActiveId(entry.target.getAttribute('id'))
        }
      })
    }, options)
    elements.forEach((el) => {
      if (el) observer.current?.observe(el)
    })
    return () => observer.current?.disconnect()
  }, [selectors, options])

  return activeId
}

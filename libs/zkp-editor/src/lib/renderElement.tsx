import Link from 'next/link'
import 'katex/dist/katex.min.css'
import TeX from '@matejmazur/react-katex'
import { RenderElementProps } from 'slate-react'

export const renderElement = (props: RenderElementProps) => {
  const { attributes, children, element } = props

  switch (element.type) {
    case 'paragraph':
      return <p {...attributes}>{children}</p>
    case 'blockquote':
      return <blockquote {...attributes}>{children}</blockquote>
    case 'break':
      return <br />
    case 'cite':
      return (
        <span {...attributes} className="text-emerald-800">
          {children}
        </span>
      )

    case 'code':
      return <code {...attributes}>{children}</code>
    case 'definition':
      return null
    case 'footnote':
      return <div>{children}</div>

    case 'footnoteDefinition': {
      const { identifier, label } = element
      return (
        <div className="flex align-baseline">
          <Link href={`#${identifier}`} passHref>
            <a className="inline font-bold text-red-500">[^{label}]</a>
          </Link>
          <p>{children}</p>
        </div>
      )
    }
    case 'footnoteReference':
      const { identifier, label } = element
      return (
        <sup>
          <Link href={`#${label}`} passHref>
            <a id={`#${identifier}`} className="font-bold text-red-500">
              [^{identifier}]
            </a>
          </Link>
        </sup>
      )

    case 'heading': {
      const CustomHeadingTag = `h${element.depth}`
      return <CustomHeadingTag {...attributes}>{children}</CustomHeadingTag>
    }
    case 'html':
      return null
    case 'image':
      return (
        <img
          src={element.url.replace(/\.+/, '')}
          alt={element.alt || 'No alt text'}
          title={element.title}
        />
      )
    case 'imageReference':
      return null
    case 'math':
    case 'inlineMath': {
      return element.children.map((child) => {
        return (
          <>
            <TeX key={child.text} errorColor="red">
              {child.text}
            </TeX>
          </>
        )
      })
    }
    case 'link': {
      const { url, title } = element
      if (url?.includes('http')) {
        return (
          <Link href={url as string} passHref>
            <a href={url}>{children}</a>
          </Link>
        )
      }

      return (
        <span className="font-bold text-red-500">
          <Link href={url as string}>
            <a href="href">{children}</a>
          </Link>
        </span>
      )
    }
    case 'linkReference':
      return null
    case 'list': {
      if (element.ordered) {
        return <ol>{children}</ol>
      }
      return <ul>{children}</ul>
    }
    case 'listItem': {
      return <li>{children}</li>
    }
    case 'mdx': {
      console.log(element)
      return null
    }
    case 'table':
    case 'tableCell':
    case 'tableRow':
    case 'thematicBreak':
      return <hr />
    case 'toml':
    case 'wikiLink': {
    }
    case 'yaml': {
      console.log(element)
    }
    default:
      return <div {...attributes}>{children}</div>
  }
}

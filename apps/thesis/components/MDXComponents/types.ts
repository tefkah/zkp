import { MDXComponents } from 'mdx/types'

export type MDXProps<T extends string = string> = React.ComponentProps<
  Extract<MDXComponents[T], keyof JSX.IntrinsicElements | React.JSXElementConstructor<any>>
>

export type MDXPropsWithId<T extends string> = MDXProps<T> & { currentId: string }
export type MDXComp<T extends string> = Exclude<MDXComponents[T], undefined | string>

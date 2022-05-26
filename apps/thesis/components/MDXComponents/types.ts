import { MDXComponents } from '@zkp/types'

export type MDXProps<T extends keyof JSX.IntrinsicElements = 'div'> = React.ComponentProps<
  Exclude<MDXComponents[T], undefined>
>

export type MDXPropsWithId<T extends keyof JSX.IntrinsicElements = 'div'> = MDXProps<T> & {
  currentId: string
}
export type MDXComp<T extends keyof JSX.IntrinsicElements = 'div'> = Exclude<
  MDXComponents[T],
  undefined | string
>

/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { MDXComponents } from 'mdx/types'
import { MDXComp, MDXProps } from './types'

export interface WithIdProps {
  /**
   * The component to be passd the Id
   */
  Component: MDXComponents[keyof JSX.IntrinsicElements]
  /**
   * The id of the page the component is rendered in.
   */
  currentId: string
}

export type Comp<T extends keyof JSX.IntrinsicElements = 'div'> = (
  props: MDXProps<T> & { currentId?: string },
) => MDXComp<T>

export const WithId = <T extends keyof JSX.IntrinsicElements = 'div'>(
  Component: React.FC<any>,
  currentId: WithIdProps['currentId'],
) => {
  const ComponentWIthID: any = (node: MDXProps<T>) => Component({ ...node, currentId })
  return ComponentWIthID
}

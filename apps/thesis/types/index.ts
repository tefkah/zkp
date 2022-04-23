import { ComponentType } from 'react'

export type ReactObjectType = Partial<{
  [TagName in keyof JSX.IntrinsicElements]:
    | keyof JSX.IntrinsicElements
    | ComponentType<JSX.IntrinsicElements[TagName]>
}>

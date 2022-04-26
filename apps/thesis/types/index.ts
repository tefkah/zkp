import { Stats } from 'fs'
import { ComponentType } from 'react'

export type ReactObjectType = Partial<{
  [TagName in keyof JSX.IntrinsicElements]:
    | keyof JSX.IntrinsicElements
    | ComponentType<JSX.IntrinsicElements[TagName]>
}>
export type NextJSCompatibleStats = Omit<Stats, 'mtime' | 'ctime' | 'atime' | 'birthtime'>
export interface DataBy {
  [slug: string]: {
    basename: string
    stats: NextJSCompatibleStats
    fullPath: string
    name: string
    folders: string[]
    path: string
    slug: string
  }
}

export * from './adapter'
export * from './api'
export * from './common'
export * from './giscus'
export * from './github'
export * from './issues'
export * from './notes'
export * from './supabase'
export * from './folders'

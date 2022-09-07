// ported from the great https://github.com/giscus/giscus

import { AvailableTheme, availableThemes, Theme } from './variables'

const isAvailableTheme = (theme: Theme): theme is AvailableTheme =>
  availableThemes?.includes(theme as AvailableTheme)

export const resolveTheme = (theme: Theme): Theme => {
  if (!theme) return 'light'
  if (isAvailableTheme(theme)) return theme
  return 'custom'
}

export const getThemeUrl = (resolvedTheme: Theme, theme: Theme): Theme =>
  resolvedTheme === 'custom' ? theme : `/themes/${resolvedTheme}.css`

export const getOriginHost = (origin: string) => {
  try {
    const url = new URL(origin)
    url.searchParams.delete('giscus')
    return { origin: url.toString(), originHost: url.origin }
  } catch (err) {
    return { origin: '', originHost: '' }
  }
}

export const cleanSessionParam = (url: string) => {
  try {
    const newUrl = new URL(url)
    newUrl.searchParams.delete('giscus')
    return newUrl.toString()
  } catch (err) {
    return url
  }
}

export const isEmpty = (v: unknown) => v === null || v === undefined || v === '' || Number.isNaN(v)

export const clipboardCopy = async (text: string) => {
  await navigator.clipboard.writeText(text)
}

export const parseRepoWithOwner = (repoWithOwner: string) => {
  const [owner, name] = repoWithOwner.split('/')
  return { owner, name }
}

export const resizeTextArea = (textarea: HTMLTextAreaElement) => {
  const maxHeight = 270
  // eslint-disable-next-line no-param-reassign
  textarea.style.height = `0px`
  const height = textarea.scrollHeight <= maxHeight ? textarea.scrollHeight : maxHeight
  // eslint-disable-next-line no-param-reassign
  textarea.style.height = `${height}px`
}

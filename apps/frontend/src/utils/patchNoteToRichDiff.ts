/**
 * Takes a patch and the patched file.
 * Turns the line-based patch into a rich, word-based diff.
 * Merges the diff into the file, creating a rich diff.
 */

import { diffChars, applyPatch } from 'diff'

export const parsePatchLine = (line: string) => {
  if (!line.startsWith('@@')) {
    throw new Error('Not a patch line')
  }

  const [_, oldRange, newRange] = line.split(' ')

  const [oldStart, oldLength] = oldRange.split(',').map(Number)
  const [newStart, newLength] = newRange.split(',').map(Number)

  return {
    oldStart,
    oldLength,
    newStart,
    newLength,
  }
}

export const reversePatch = (patch: string) => {
  const lines = patch.split('\n')

  const [header, ...body] = lines

  const { oldStart, oldLength, newStart, newLength } = parsePatchLine(header)

  const newHeader = `@@ ${-newStart},${newLength} ${
    oldStart > 0 ? `-${oldStart}` : `+${-oldStart}`
  },${oldLength} @@`

  const newBody = body.map((line) => {
    if (line.startsWith('+')) {
      return line.replace('+', '-')
    }

    if (line.startsWith('-')) {
      return line.replace('-', '+')
    }

    return line
  })

  return [newHeader, ...newBody].join('\n')
}

export const patchAndNewTextToRichDiff = (
  patch: string,
  text: string,
  html = false,
  reversed = true,
) => {
  const reversedPatch = reversed ? reversePatch(patch) : patch
  console.log('reversedPatch', reversedPatch)

  const prevText = applyPatch(text, reversedPatch) || ''
  console.log('prevtext', prevText)

  const prevTextWithoutFrontMatter = prevText.replace(/^---.*?---/ms, '')
  const newTextWithoutFrontMatter = text.replace(/^---.*?---/ms, '')

  const diff = diffChars(prevTextWithoutFrontMatter, newTextWithoutFrontMatter)

  const richDiff = diff
    .map((part) => {
      if (part.added) {
        if (!/\n/.test(part.value)) {
          return `<ins class${html ? '' : 'Name'}="text-emerald-500 bg-emerald-100">${
            part.value
          }</ins>`
        }
        return part.value
          ?.split('\n')
          .map(
            (piece) =>
              `<div class${
                html ? '' : 'Name'
              }="text-emerald-500 bg-emerald-100">\n${piece}\n</div>\n`,
          )
          .join('\n')
      }

      if (part.removed) {
        if (!/\n/.test(part.value)) {
          return `<del class${html ? '' : 'Name'}="text-rose-500 bg-rose-100 line-through">${
            part.value
          }</del>`
        }
        return part.value
          ?.split('\n')
          .map(
            (line) =>
              `<div class${
                html ? '' : 'Name'
              }="text-rose-500 bg-rose-100 line-through">\n${line}\n</div>`,
          )
          .join('\n')
      }

      return part.value
    })
    .join('')

  return {
    reversedPatch,
    prevText,
    diff,
    richDiff: richDiff ?? '',
  }
}

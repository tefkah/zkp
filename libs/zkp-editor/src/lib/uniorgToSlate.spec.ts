import type { OrgToSlateOptions } from './uniorgToSlate'
import { unified } from 'unified'
import orgParse from 'uniorg-parse'
import org2Slate from './uniorgToSlatePlugin'
import { readFileSync } from 'fs'

const process = (input: string, options?: Partial<OrgToSlateOptions>) => {
  const processor = unified().use(orgParse).use(org2Slate)

  const orgast = processor.processSync(input).result

  return orgast
}

expect.addSnapshotSerializer({
  test(value) {
    return typeof value === 'string'
  },
  print(value) {
    return value as string
  },
})

const slateTest = (name: string, input: string, options?: Partial<OrgToSlateOptions>) => {
  it(name, () => {
    const result = process(input, options)
    expect(result).toMatchSnapshot()
  })
}
slateTest.skip = (name: string, input: string, options?: Partial<OrgToSlateOptions>) => {
  it.skip(name, () => {
    const result = process(input, options)
    expect(result).toMatchSnapshot()
  })
}
slateTest.only = (name: string, input: string, options?: Partial<OrgToSlateOptions>) => {
  it.only(name, () => {
    const result = process(input, options)
    expect(result).toMatchSnapshot()
  })
}
slateTest.todo = (name: string, _input?: string, _options?: Partial<OrgToSlateOptions>) => {
  it.todo(name)
}

describe('org/org-to-slate', () => {
  slateTest('empty', ``)
  slateTest('big boy', readFileSync('./notes/Chapters/III. Anyons.org', { encoding: 'utf8' }))

  slateTest('paragraph', `hello`)

  slateTest('headline', `* hi`)

  slateTest(
    'multiple headlines',
    `* hi
** there
* hello
*** world
`,
  )

  slateTest('complex headline', `* TODO [#A] headline /italic/ title :some:tags:`)

  slateTest(
    'headline with sections',
    `hello
* hi
section
** hello
another section`,
  )

  slateTest(
    'does not export :noexport: headline',
    `* hello
some text
* nope :noexport:
not exported text
`,
  )

  slateTest(
    'useSections',
    `hello
* headline 1
text
** headline 1.1
more text
* headline 2`,
    { useSections: true },
  )

  slateTest(
    'planning',
    `* headline
CLOSED: [2019-03-13 Wed 23:48] SCHEDULED: [2019-03-13 Wed] DEADLINE: [2019-03-14 Thu]`,
  )

  slateTest(
    'property drawer',
    `* headline
:PROPERTIES:
:CREATED: [2019-03-13 Wed 23:57]
:END:`,
  )

  slateTest(
    'custom drawer',
    `:MYDRAWER:
hello /there/
:END:`,
  )

  slateTest('list', `- hello`)

  slateTest('ordered list', `1. one`)

  slateTest(
    'nested list',
    `
- hello
  - world
  - blah
- hi
`,
  )

  slateTest(
    'description list',
    `- term1 :: description 1
- term 2 :: description 2`,
  )

  // See https://github.com/rasendubi/uniorg/issues/15
  slateTest(
    'description list with complex tags',
    `
- [[https://example.com][Example]] :: Hello there!
- [[https://github.com][GitHub]] :: This is GitHub, your hub for Git repos.
- *Gitlab* :: Alternative to GitHub
- /Sourcehut/ :: Another alternative to GitHub that primarily uses email-based workflows.
- /Codeberg/ :: *ANOTHER ALTERNATIVE*
- /*self-hosting Git server*/ :: /*The ultimate Git solution for privacy-oriented individuals!*/
`,
  )

  slateTest('link', `https://example.com`)

  slateTest('link mixed with text', `hello http://example.com blah`)

  slateTest('escape local link', `[[./path with "spaces".org][path with "spaces"]]`)

  slateTest(
    'escape local link with percent',
    `[[file:local%2Bpath%2Bwith%2Bpercents.org][local path with percents]]`,
  )

  slateTest(
    'do not double-escape urls',
    `[[http://localhost:3000/path%2Bwith%2Bpercents][path with percents]]`,
  )

  slateTest(
    'src block',
    `#+begin_src c
,*a = b;
printf("%d\\n", *a);
#+end_src`,
  )

  slateTest(
    'verse block',
    `#+BEGIN_VERSE
 Great clouds overhead
 Tiny black birds rise and fall
 Snow covers Emacs

    ---AlexSchroeder
#+END_VERSE`,
  )

  slateTest(
    'center block',
    `#+begin_center
hello
#+end_center`,
  )

  slateTest(
    'comment block',
    `#+begin_comment
hello
#+end_comment`,
  )

  slateTest(
    'remove common src block offset',
    `
  #+begin_src
    hello
      world
  #+end_src`,
  )

  slateTest(
    'example block',
    `#+begin_example
example
#+end_example`,
  )

  slateTest(
    'export block',
    `#+begin_export
export
#+end_export`,
  )

  slateTest(
    'export html block',
    `
#+begin_export html
<abbr title="World Health Organization">WHO</abbr> was founded in 1948.
#+end_export
`,
  )

  slateTest(
    'export html keyword',
    `hello
#+HTML: <h1>html tag</h1>`,
  )

  slateTest(
    'special block',
    `#+begin_blah
hello
#+end_blah`,
  )

  slateTest(
    'html5 fancy block',
    `#+begin_aside
hello
#+end_aside`,
  )

  slateTest(
    'blockquote',
    `#+begin_quote
hello, world!
#+end_quote`,
  )

  slateTest('keywords', `#+TITLE: blah`)

  slateTest('emphasis', `/Consider/ ~t*h*e~ *following* =example= +strike+ _under_`)

  slateTest('superscript', `hello^there`)

  slateTest('subscript', `hello_there`)

  slateTest('images', `[[./image.png]]`)

  describe('timestamps', () => {
    slateTest('inactive', `[2021-01-07 Thu]`)
    slateTest('inactive-range', `[2021-01-07 Thu]--[2021-01-08 Fri]`)
    slateTest('active', `<2021-01-07 Thu>`)
    slateTest('active-range', `<2021-01-07 Thu>--<2021-01-09 Sat>`)
    slateTest('with time', `[2021-01-07 Thu 19:36]`)
    slateTest('time range', `[2021-01-07 Thu 19:36-20:38]`)
    slateTest.todo('diary')
  })

  slateTest(
    'table',
    `
| head1  | head2 |
|--------+-------|
| value1 | value2 |
`,
  )

  slateTest(
    'table without header',
    `
| value1 | value2 |
| value3 | value4 |
`,
  )

  slateTest(
    'table, multiple body',
    `
| head1  | head2 |
|--------+-------|
| value1 | value2 |
| value3 | value4 |
|--------+--------|
| value5 | value6 |
`,
  )

  slateTest(
    'table.el table',
    `
+------+
| blah |
+------+
`,
  )

  slateTest(
    'comments',
    `hello
# comment
there`,
  )

  slateTest('fixed-width', `: hello`)

  slateTest('clock', `CLOCK: [2020-12-22 Tue 09:07]--[2020-12-22 Tue 11:10] =>  2:03`)

  slateTest(
    `latex environment`,
    `\\begin{hello}
some text
\\end{hello}`,
  )

  slateTest('horizontal rule', `-----`)

  slateTest('diary sexp', `%%(diary-anniversary 10 31 1948) Arthur's birthday (%d years old)`)

  describe('footnotes', () => {
    slateTest(
      'footnote-reference',
      `Some text with a footnote.[fn:1]

[fn:1] A very important footnote.`,
    )

    slateTest(
      'footnote-definition',
      `Some text with a footnote.[fn:1]
Another footnote [fn:2]

[fn:1] A very important footnote.
[fn:2] Another stellar footnote.`,
    )

    slateTest('inline footnote', 'some text[fn:1: footnote definition]')

    slateTest(
      'maintains footnotes order',
      // Note that footnotes are emmitted in order of reference
      `footnote 2[fn:2]
footnote 1[fn:1]

[fn:1] second footnote
[fn:2] first footnote`,
    )

    slateTest(
      'does not emit unreferenced footnotes',
      `footnote[fn:1]

[fn:1] hello
[fn:2] unreferenced`,
    )

    slateTest('handles missing footnotes', 'footnote[fn:missing]')

    slateTest('inline footnote', 'footnotes[fn:label: inline footnote definition]')

    slateTest('anonymous inline footnote', 'footnotes[fn:: inline footnote definition]')
  })

  slateTest(
    'latex-fragment',
    `If $a^2=b$ and \\( b=2 \\), then the solution must be
either $$ a=+\\sqrt{2} $$ or \\[ a=-\\sqrt{2} \\].`,
  )

  slateTest('entity', `\\Agrave`)
})

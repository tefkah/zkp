import { fileListReducer } from '@zkp/folders'
import mdxSerialize from '@zkp/mdxSerialize'
import { BIB_PATH, DATA_DIR, NEXT_PUBLIC_NOTE_DIR } from '@zkp/paths'
import { DataBy } from '@zkp/types'
import { writeFile, readFile } from 'fs/promises'
import { getAllLinkedTextLinks } from 'libs/utils/mdx/src/lib/getAllLinkedTexts'
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import { join } from 'path'
import { catchPromise } from 'try-catch'
import { NoteScrollContainer } from '../Components/FileViewer'
import { MDXNote } from '../Components/FileViewer/MDXNote'

export type InitialNoteCache = {
  [k: string]: {
    readonly data: {
      readonly slug: string
      readonly title: string
      readonly linkedNoteSlugs: string[]
      readonly backlinkedNotes: {
        linkingNoteTitle: string
        linkingNoteSlug: string
        contextBlocks: string[]
      }[]
      readonly contentMarkdown: string
      readonly content?: {
        frontMatter: Record<string, any>
        source: MDXRemoteSerializeResult<Record<string, unknown>>
      }
    }
  }
}

export interface FilePageProps {
  initialNoteCache: InitialNoteCache
  bibliography: string
}

const File = (props: FilePageProps) => {
  const { initialNoteCache, bibliography } = props
  return (
    <div className="h-[100vh] w-[100vw]">
      {/* <p>{JSON.stringify(props, null, 4)}</p>
      <p>{JSON.stringify(props).length}</p> */}
      <NoteScrollContainer data={initialNoteCache} />
    </div>
  )
}

export default File

// export const getStaticPaths = async () => {
//   const data = JSON.parse(await readFile(join(DATA_DIR, 'dataBySlug.json'), 'utf8')) as DataBy

//   const paths = Object.values(data)
//     // Remove file extensions for page paths
//     .map((entry) => {
//       return entry.slug
//     })
//     // Map the path into the static paths object required by Next.js
//     .map((file) => ({ params: { file } }))

//   return {
//     paths,
//     fallback: 'blocking',
//   }
// }

// export const getStaticProps: GetStaticProps = async (context) => {
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context
  console.log(context)
  const { file: initialNote, s } = context.query
  const file = (Array.isArray(initialNote) ? initialNote.join('/') : initialNote) ?? ''
  const stack = s ? (Array.isArray(s) ? s : [s]) : []
  const notes = [file, ...stack]
  console.log(params)

  console.log(notes.length)
  const data = JSON.parse(await readFile(join(DATA_DIR, 'dataBySlug.json'), 'utf8')) as DataBy

  const initialNoteCache = Object.fromEntries(
    await Promise.all(
      notes.map(async (note) => {
        const d = data[note]
        const file = await readFile(join(NEXT_PUBLIC_NOTE_DIR, note), 'utf8')

        const linkedNoteSlugs = await getAllLinkedTextLinks(file)

        const backlinkedNotes = d.backlinks.map((backlink) => ({
          linkingNoteTitle: backlink.name,
          linkingNoteSlug: backlink.slug,
          contextBlocks: backlink.sentences,
          //"hidden": false
        }))

        const content = await mdxSerialize(file)

        return [
          note,
          {
            data: {
              slug: note,
              title: d.name,
              linkedNoteSlugs,
              backlinkedNotes,
              contentMarkdown: file,
              content,
            },
          },
        ] as const
      }),
    ),
  )

  // const { name } = data[file]

  // const input = await readFile(join(NEXT_PUBLIC_NOTE_DIR, file), 'utf8')

  const bibliography = join(BIB_PATH)

  // const [{ frontMatter, source }, error] = await catchPromise(mdxSerialize(input, bibliography))

  // const fileList = fileListReducer(Object.values(data))
  // console.log(JSON.stringify(fileList).length)

  // const intitialNoteCache  =
  const props = {
    initialNoteCache,
    bibliography,

    // ...(error ? { source: 'Whoops' } : { source }),
    // frontMatter,
    // fileList,
  }

  return {
    props,
  }
}

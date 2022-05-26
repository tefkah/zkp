import { DataBy } from '@zkp/types'
import { readFile } from 'fs/promises'
import { Client } from 'redis-om'
import { JsonRepository } from 'redis-om/dist/repository/repository'
import { catchPromise } from 'try-catch'
import { connect, Note, NoteData, schema } from './redis'

interface Props {
  url: string
  token: string
  notes: DataBy
}

export const syncRedis = async ({ url, token, notes }: Props) => {
  const client = new Client()

  await connect(client, process.env.REDIS_URL)

  const repo = new JsonRepository(schema, client)

  const notePromises: Promise<Note>[] = []

  for (const note of Object.values(notes)) {
    const promise = uploadOneThingToRedis({ url, token, note, repo })
    notePromises.push(promise)
  }

  return await Promise.all(notePromises)

  // read notes
  // uplo
}

const standardMapFn = (data: string[]): string => {
  let type = ''
  data.forEach((thing) => {
    switch (thing.toLowerCase()) {
      case 'definition': {
        type = 'definition'
        return
      }
      case 'chapter': {
        type = 'chapter'
      }
    }
  })
  return type
}

const noteType = (
  { folders, tags }: { folders: string[]; tags?: string[] },
  mapFn?: (data: string[]) => string,
) => {
  const fn = mapFn ?? standardMapFn

  const newData = [...folders, ...(tags || [])]
  return fn(newData)
}

export const uploadOneThingToRedis = async ({
  url,
  token,
  note,
  repo,
}: {
  url: string
  token: string
  note: DataBy[string]
  repo: JsonRepository<Note>
}) => {
  const { slug, fullPath, name, folders } = note
  const [file, error] = await catchPromise(readFile(fullPath, 'utf-8'))

  const newNote: NoteData = {
    slug,
    title: name,
    body: file,
    type: noteType({ folders }),
  }

  const createdNote = repo.createAndSave(newNote)

  return createdNote
}

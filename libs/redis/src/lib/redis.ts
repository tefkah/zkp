import { Client, Entity, Schema } from 'redis-om'
import { JsonRepository as Repository } from 'redis-om/dist/repository/repository.js'

const client = new Client()

export async function connect(client: Client, url?: string) {
  if (!client.isOpen()) {
    await client.open(url || process.env.REDIS_URL)
  }
}

export class Note extends Entity {}
export const schema = new Schema(
  Note,
  {
    slug: { type: 'string' },
    title: { type: 'text' },
    type: { type: 'string' },
    //    image: { type: 'string' },
    body: { type: 'text' },
  },
  {
    dataStructure: 'JSON',
  },
)

export async function createComment() {}

export interface NoteData {
  slug: string
  title: string
  type: string
  body: string
  [key: string]: string
}

export async function createNote(data: NoteData) {
  await connect(client, process.env.REDIS_URL)

  const repository = new Repository(schema, client)

  const note = repository.createEntity(data)

  const id = await repository.save(note)
  return id
}

export async function getNote(id: string) {
  await connect(client, process.env.REDIS_URL)

  const repository = new Repository(schema, client)
  return repository.fetch(id)
}

export async function createIndex() {
  await connect(client, process.env.REDIS_URL)

  const repository = new Repository(schema, client)
  await repository.createIndex()
}

export async function searchNotes(q: string) {
  await connect(client, process.env.REDIS_URL)

  const repository = new Repository(schema, client)

  const notes = await repository
    .search()
    .where('note')
    .eq(q)
    .or('title')
    .eq(q)
    .or('body')
    .matches(q)
    .return.all()

  return notes
}

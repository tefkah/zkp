import dotenv from 'dotenv'
import {
  NEXT_PUBLIC_NOTE_DIR,
  APP_DIR,
  BASE_URL,
  BIB_PATH,
  BIB_URL,
  DATA_DIR,
  GIT_DIR,
} from './paths'
dotenv.config({ path: 'libs/paths/.env.test' })

describe('paths', () => {
  it('should give paths', () => {
    expect(NEXT_PUBLIC_NOTE_DIR).toEqual('apps/thesis/public/notes')
  })

  it('notes', () => {})
})

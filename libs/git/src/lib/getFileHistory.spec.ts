import { getFileHistory } from './getFileHistory'

it('should get file history', async () => {
  const history = await getFileHistory({ file: 'Topological Space.md' })
  expect(history).toBeDefined()
})

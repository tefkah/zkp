import { slugify, deslugify } from './slugify'

describe('zkpSlugify', () => {
  it('should work', () => {
    expect(slugify('aashta-ashts')).toEqual('aashta_ashts')
  })
})

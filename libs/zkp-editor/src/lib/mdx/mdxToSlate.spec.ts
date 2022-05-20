import { mdxSlate } from './mdxToSlate'

describe('processor', () => {
  it('should create standard stuff from standard .md', () => {
    expect(mdxSlate('# Hey')).toMatchSnapshot()
  })

  it('should handle wikilinks', () => {
    expect(mdxSlate('# hey\n [[Link|Alias]]')).toMatchSnapshot()
  })

  it('should handle citations', () => {
    expect(mdxSlate('[@Shech2019]\n @Shech2019')).toMatchSnapshot()
  })

  it('should handle math', () => {
    expect(mdxSlate('$$ \\frac{1}{2}$$')).toMatchSnapshot()
  })
})

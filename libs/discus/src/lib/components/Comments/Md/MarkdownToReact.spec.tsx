import { render } from '@testing-library/react'

import { MarkdownToReact } from './MarkdownToReact'

describe('Md', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MarkdownToReact>{'> Wow, such markdown'}</MarkdownToReact>)
    expect(baseElement).toBeTruthy()
  })
})

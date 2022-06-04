import { render } from '@testing-library/react'

import CommentBoxContents from './CommentBoxContents'

describe('CommentBoxContents', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CommentBoxContents />)
    expect(baseElement).toBeTruthy()
  })
})

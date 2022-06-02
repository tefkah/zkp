import { render } from '@testing-library/react'

import { CommentBody } from './CommentBody'

describe('DiscussionCard', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CommentBody />)
    expect(baseElement).toBeTruthy()
  })
})

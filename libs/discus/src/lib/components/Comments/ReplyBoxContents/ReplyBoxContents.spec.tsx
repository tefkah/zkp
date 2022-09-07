import { render } from '@testing-library/react'

import ReplyBoxContents from './ReplyBoxContents'

describe('ReplyBoxContents', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ReplyBoxContents />)
    expect(baseElement).toBeTruthy()
  })
})

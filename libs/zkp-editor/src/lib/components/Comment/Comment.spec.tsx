import { render } from '@testing-library/react'

import Comment from './Comment'

describe('Comment', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Comment />)
    expect(baseElement).toBeTruthy()
  })
})

import { render } from '@testing-library/react'

import { NewDiscussion } from './NewDiscussion'

describe('NewDiscussion', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<NewDiscussion />)
    expect(baseElement).toBeTruthy()
  })
})

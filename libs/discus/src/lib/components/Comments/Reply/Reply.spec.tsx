import { render } from '@testing-library/react'

import { Reply } from './Reply'

describe('Reply', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Reply />)
    expect(baseElement).toBeTruthy()
  })
})

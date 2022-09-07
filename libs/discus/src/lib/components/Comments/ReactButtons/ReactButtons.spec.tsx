import { render } from '@testing-library/react'

import { ReactButtons } from './ReactButtons'

describe('ReactButtons', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ReactButtons />)
    expect(baseElement).toBeTruthy()
  })
})

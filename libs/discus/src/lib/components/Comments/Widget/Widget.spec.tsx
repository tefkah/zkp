import { render } from '@testing-library/react'

import Widget from './Widget'

describe('Widget', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Widget />)
    expect(baseElement).toBeTruthy()
  })
})

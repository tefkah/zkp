import { render } from '@testing-library/react'

import { Discus } from './discus'

describe('Discus', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Discus />)
    expect(baseElement).toBeTruthy()
  })
})

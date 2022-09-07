import { render } from '@testing-library/react'

import Giscus from './Giscus'

describe('Giscus', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Giscus />)
    expect(baseElement).toBeTruthy()
  })
})

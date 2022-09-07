import { render } from '@testing-library/react'

import TinyEditor from './TinyEditor'

describe('TinyEditor', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TinyEditor />)
    expect(baseElement).toBeTruthy()
  })
})

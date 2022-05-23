import { render } from '@testing-library/react'

import Popover from './popover'

describe('Popover', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Popover />)
    expect(baseElement).toBeTruthy()
  })
})

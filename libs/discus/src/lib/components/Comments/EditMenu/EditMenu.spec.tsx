import { render } from '@testing-library/react'

import EditMenu from './EditMenu'

describe('EditMenu', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<EditMenu />)
    expect(baseElement).toBeTruthy()
  })
})

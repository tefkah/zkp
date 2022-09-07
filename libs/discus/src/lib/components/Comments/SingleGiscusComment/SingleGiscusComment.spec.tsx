import { render } from '@testing-library/react'

import SingleGiscusComment from './SingleGiscusComment'

describe('SingleGiscusComment', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SingleGiscusComment />)
    expect(baseElement).toBeTruthy()
  })
})

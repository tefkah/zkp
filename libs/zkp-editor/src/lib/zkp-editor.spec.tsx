import { render } from '@testing-library/react'

import ZkpEditor from './zkp-editor'

describe('ZkpEditor', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ZkpEditor />)
    expect(baseElement).toBeTruthy()
  })
})

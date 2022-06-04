import { render } from '@testing-library/react'

import { DiscussionCard } from './DiscussionCard'

describe('DiscussionCard', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DiscussionCard />)
    expect(baseElement).toBeTruthy()
  })
})

import { describe, it, expect } from 'vitest'

import { getResults } from '../results'

describe('getResults', () => {
  it('returns the stock list', () => {
    const results = getResults()
    expect(results).toHaveLength(3)
    expect(results.map((r) => r.symbol)).toEqual(['GPRE', 'TSLX', 'FTHI'])
  })

  it('returns a copy so callers cannot mutate the source', () => {
    getResults().pop()
    expect(getResults()).toHaveLength(3)
  })
})

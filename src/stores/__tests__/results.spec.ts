import { describe, it, expect, beforeEach } from 'vitest'

import { setActivePinia, createPinia } from 'pinia'
import { useResultsStore } from '../results'

const stocks = [
  { id: 1, name: 'Green Plains, Inc.', symbol: 'GPRE', return_yearly_1: 6.3 },
  { id: 2, name: 'TPG Specialty Lending, Inc.', symbol: 'TSLX', return_yearly_1: -2.4 },
]

describe('useResultsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('starts empty', () => {
    expect(useResultsStore().results).toEqual([])
  })

  it('stores a copy of the given results', () => {
    const store = useResultsStore()
    const input = stocks.slice()

    store.setResults(input)
    input.pop()

    expect(store.results).toHaveLength(2)
    expect(store.results.map((r) => r.symbol)).toEqual(['GPRE', 'TSLX'])
  })
})

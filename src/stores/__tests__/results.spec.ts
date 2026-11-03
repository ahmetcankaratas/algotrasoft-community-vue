import { describe, it, expect, beforeEach } from 'vitest'

import { setActivePinia, createPinia } from 'pinia'
import { useResultsStore } from '../results'

const stocks = [
  { id: 1, name: 'Green Plains, Inc.', symbol: 'GPRE' },
  { id: 2, name: 'TPG Specialty Lending, Inc.', symbol: 'TSLX' },
]

const backtest = {
  id: 1,
  symbol: 'GPRE',
  name: 'Green Plains, Inc.',
  market: 'NASDAQ',
  sector: 'Energy',
  industry: 'Renewable Fuels',
  market_cap: '1.6B',
  return_monthly_1: 1.2,
  return_monthly_3: 2.8,
  return_monthly_6: 4.1,
  return_yearly_1: 6.3,
}

describe('useResultsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('starts empty', () => {
    expect(useResultsStore().results).toEqual([])
    expect(useResultsStore().details).toBeNull()
  })

  it('stores a copy of the given results', () => {
    const store = useResultsStore()
    const input = stocks.slice()

    store.setResults(input)
    input.pop()

    expect(store.results).toHaveLength(2)
    expect(store.results.map((r) => r.symbol)).toEqual(['GPRE', 'TSLX'])
  })

  it('stores a copy of the given details', () => {
    const store = useResultsStore()
    const input = { ...backtest }

    store.setDetails(input)
    input.market = 'NYSE'

    expect(store.details?.market).toBe('NASDAQ')
    expect(store.details).not.toBe(input)
  })

  it('clears the details when given null', () => {
    const store = useResultsStore()
    store.setDetails(backtest)

    store.setDetails(null)

    expect(store.details).toBeNull()
  })
})

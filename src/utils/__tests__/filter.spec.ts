import { describe, it, expect } from 'vitest'

import { filterByProperty } from '../filter'

const stocks = [
  { id: 1, name: 'Green Plains, Inc.', symbol: 'GPRE' },
  { id: 2, name: 'TPG Specialty Lending, Inc.', symbol: 'TSLX' },
  { id: 3, name: 'First Trust High Income ETF', symbol: 'FTHI' },
]

describe('filterByProperty', () => {
  it('returns the same array for an empty query', () => {
    expect(filterByProperty(stocks, '', 'name')).toBe(stocks)
  })

  it('returns the same array when there is nothing to filter', () => {
    const empty: typeof stocks = []
    expect(filterByProperty(empty, 'green', 'name')).toBe(empty)
  })

  it('matches the property case-insensitively anywhere in the value', () => {
    expect(filterByProperty(stocks, 'INC.', 'name').map((s) => s.symbol)).toEqual(['GPRE', 'TSLX'])
    expect(filterByProperty(stocks, 'trust', 'name').map((s) => s.symbol)).toEqual(['FTHI'])
  })

  it('can filter on another string property', () => {
    expect(filterByProperty(stocks, 'ts', 'symbol').map((s) => s.id)).toEqual([2])
  })

  it('returns an empty array when nothing matches', () => {
    expect(filterByProperty(stocks, 'xyz', 'name')).toEqual([])
  })
})

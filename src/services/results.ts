import type { MarketResponse, MarketResponseResult } from '@/types/market'

const results: MarketResponse = {
  data: {
    stocks: [
      { id: 1, name: 'Green Plains, Inc.', symbol: 'GPRE', return_yearly_1: 6.3 },
      { id: 2, name: 'TPG Specialty Lending, Inc.', symbol: 'TSLX', return_yearly_1: -2.4 },
      { id: 3, name: 'First Trust High Income ETF', symbol: 'FTHI', return_yearly_1: 4.3 },
    ],
  },
}

export function getResults(): MarketResponseResult[] {
  return results.data.stocks.slice()
}

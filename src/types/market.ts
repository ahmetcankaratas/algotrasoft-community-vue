export interface MarketResponseResult {
  id: number
  symbol: string
  name: string
  return_yearly_1: number
}

export interface MarketResponse {
  data: {
    stocks: MarketResponseResult[]
  }
}

export interface StockDetails {
  id: number
  symbol: string
  name: string
}

export interface MarketResponse {
  stocks: StockDetails[]
}

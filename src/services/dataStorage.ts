import { http } from './http'
import type { MarketResponse } from '@/types/market'
import type { BacktestResponseResult } from '@/types/backtest'

const DATABASE_URL =
  'https://algotrasoft-community-angular-default-rtdb.europe-west1.firebasedatabase.app'

export async function getStocks(): Promise<MarketResponse> {
  const { data } = await http.get<MarketResponse>(`${DATABASE_URL}/market.json`)
  return data
}

// The realtime database answers 200 with a null body for a path that does not exist.
export async function getBacktest(id: number): Promise<BacktestResponseResult | null> {
  const { data } = await http.get<BacktestResponseResult | null>(
    `${DATABASE_URL}/backtests/results/${id}.json`,
  )
  return data
}

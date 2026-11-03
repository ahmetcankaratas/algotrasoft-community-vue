import { http } from './http'
import type { MarketResponse } from '@/types/market'
import type { BacktestDetails } from '@/types/backtest'

const DATABASE_URL = import.meta.env.VITE_FIREBASE_DATABASE_URL

export async function getStocks(): Promise<MarketResponse> {
  const { data } = await http.get<MarketResponse>(`${DATABASE_URL}/market.json`)
  return data
}

// The realtime database answers 200 with a null body for a path that does not exist.
export async function getBacktest(id: number): Promise<BacktestDetails | null> {
  const { data } = await http.get<BacktestDetails | null>(
    `${DATABASE_URL}/backtests/results/${id}.json`,
  )
  return data
}

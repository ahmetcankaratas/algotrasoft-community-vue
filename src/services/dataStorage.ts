import { http } from './http'
import type { MarketResponse } from '@/types/market'

const DATABASE_URL =
  'https://algotrasoft-community-angular-default-rtdb.europe-west1.firebasedatabase.app'

export async function getStocks(): Promise<MarketResponse> {
  const { data } = await http.get<MarketResponse>(`${DATABASE_URL}/market.json`)
  return data
}

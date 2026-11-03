import { describe, it, expect, vi, afterEach } from 'vitest'

import { getStocks, getBacktest } from '../dataStorage'
import { http } from '../http'

vi.hoisted(() => {
  vi.stubEnv('VITE_FIREBASE_DATABASE_URL', 'https://db.example.test')
})

vi.mock('../http', () => ({
  http: { get: vi.fn<typeof http.get>() },
}))

const getMock = vi.mocked(http.get)

describe('getStocks', () => {
  afterEach(() => {
    getMock.mockReset()
  })

  it('reads the market list from the realtime database', async () => {
    const stocks = [{ id: 1, name: 'Green Plains, Inc.', symbol: 'GPRE' }]
    getMock.mockResolvedValue({ data: { stocks } })

    const data = await getStocks()

    expect(data.stocks).toEqual(stocks)
    expect(getMock).toHaveBeenCalledWith('https://db.example.test/market.json')
  })
})

describe('getBacktest', () => {
  afterEach(() => {
    getMock.mockReset()
  })

  it('reads one backtest result by id from the realtime database', async () => {
    const backtest = { id: 2, symbol: 'TSLX', name: 'TPG Specialty Lending, Inc.' }
    getMock.mockResolvedValue({ data: backtest })

    const data = await getBacktest(1)

    expect(data).toEqual(backtest)
    expect(getMock).toHaveBeenCalledWith('https://db.example.test/backtests/results/1.json')
  })

  it('returns null when the database has no entry for the id', async () => {
    getMock.mockResolvedValue({ data: null })

    expect(await getBacktest(99)).toBeNull()
  })
})

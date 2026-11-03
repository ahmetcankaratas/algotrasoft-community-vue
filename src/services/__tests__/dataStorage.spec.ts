import { describe, it, expect, vi, afterEach } from 'vitest'

import { getStocks } from '../dataStorage'
import { http } from '../http'

vi.mock('../http', () => ({
  http: { get: vi.fn<typeof http.get>() },
}))

const getMock = vi.mocked(http.get)

describe('getStocks', () => {
  afterEach(() => {
    getMock.mockReset()
  })

  it('reads the market list from the realtime database', async () => {
    const stocks = [{ id: 1, name: 'Green Plains, Inc.', symbol: 'GPRE', return_yearly_1: 6.3 }]
    getMock.mockResolvedValue({ data: { stocks } })

    const data = await getStocks()

    expect(data.stocks).toEqual(stocks)
    expect(getMock).toHaveBeenCalledWith(
      'https://algotrasoft-community-angular-default-rtdb.europe-west1.firebasedatabase.app/market.json',
    )
  })
})

import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { MarketResponseResult } from '@/types/market'
import type { BacktestResponseResult } from '@/types/backtest'

export const useResultsStore = defineStore('results', () => {
  const results = ref<MarketResponseResult[]>([])
  const details = ref<BacktestResponseResult | null>(null)

  function setResults(next: MarketResponseResult[]) {
    results.value = next.slice()
  }

  function setDetails(next: BacktestResponseResult | null) {
    details.value = next ? { ...next } : null
  }

  return { results, details, setResults, setDetails }
})

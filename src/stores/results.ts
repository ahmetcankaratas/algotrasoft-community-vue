import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { StockDetails } from '@/types/market'
import type { BacktestDetails } from '@/types/backtest'

export const useResultsStore = defineStore('results', () => {
  const results = ref<StockDetails[]>([])
  const details = ref<BacktestDetails | null>(null)

  function setResults(next: StockDetails[]) {
    results.value = next.slice()
  }

  function setDetails(next: BacktestDetails | null) {
    details.value = next ? { ...next } : null
  }

  return { results, details, setResults, setDetails }
})

import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { MarketResponseResult } from '@/types/market'

export const useResultsStore = defineStore('results', () => {
  const results = ref<MarketResponseResult[]>([])

  function setResults(next: MarketResponseResult[]) {
    results.value = next.slice()
  }

  return { results, setResults }
})

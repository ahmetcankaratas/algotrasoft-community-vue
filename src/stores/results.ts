import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { StockDetails } from '@/types/market'

export const useResultsStore = defineStore('results', () => {
  const results = ref<StockDetails[]>([])

  function setResults(next: StockDetails[]) {
    results.value = next.slice()
  }

  return { results, setResults }
})

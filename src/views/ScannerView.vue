<template>
  <AppLayout>
    <PageCover header="Scanner" description="Backtesting Results of Ross Hook Trading Strategy" />
    <div class="container mx-auto px-6 pt-12 pb-20 md:pb-24">
      <div
        v-if="isLoading"
        class="dark:bg-darkBlue3 flex h-28 w-full items-center justify-center rounded-lg bg-gray-100 p-4"
      >
        <LoadingSpinner />
      </div>
      <ScannerSearch v-if="!isLoading" v-model="searchQuery" />
      <ResultList :query="searchQuery" />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import PageCover from '@/components/PageCover.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ScannerSearch from '@/components/scanner/ScannerSearch.vue'
import ResultList from '@/components/scanner/ResultList.vue'
import { getStocks } from '@/services/dataStorage'
import { useResultsStore } from '@/stores/results'

const resultsStore = useResultsStore()
const isLoading = ref(true)
const searchQuery = ref('')

async function loadResults() {
  try {
    const { stocks } = await getStocks()
    resultsStore.setResults(stocks)
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

loadResults()
</script>

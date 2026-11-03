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
      <ErrorAlert v-if="error" :message="error" />
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
import ErrorAlert from '@/components/ErrorAlert.vue'
import ScannerSearch from '@/components/scanner/ScannerSearch.vue'
import ResultList from '@/components/scanner/ResultList.vue'
import { getStocks } from '@/services/dataStorage'
import { useResultsStore } from '@/stores/results'
import { useRequestStatus } from '@/composables/useRequestStatus'

const resultsStore = useResultsStore()
const { isLoading, error, run } = useRequestStatus()
const searchQuery = ref('')

async function loadResults() {
  await run(async () => {
    const { stocks } = await getStocks()
    resultsStore.setResults(stocks)
  })
}

loadResults()
</script>

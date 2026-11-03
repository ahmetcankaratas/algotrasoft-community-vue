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
      <ResultDetails v-if="!isLoading" />
      <BackButton />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import PageCover from '@/components/PageCover.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import BackButton from '@/components/BackButton.vue'
import ResultDetails from '@/components/scanner/ResultDetails.vue'
import { getBacktest } from '@/services/dataStorage'
import { useResultsStore } from '@/stores/results'

const route = useRoute()
const resultsStore = useResultsStore()
const isLoading = ref(true)

async function loadDetails(id: number) {
  isLoading.value = true
  try {
    resultsStore.setDetails(await getBacktest(id))
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

// Re-fetch when the id changes while this view stays mounted (e.g. /scanner/0 -> /scanner/1).
watch(
  () => route.params.id,
  (id) => {
    if (id !== undefined) loadDetails(Number(id))
  },
  { immediate: true },
)
</script>

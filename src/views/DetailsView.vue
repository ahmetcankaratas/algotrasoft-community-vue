<template>
  <AppLayout>
    <PageCover :header="details?.name" description="Result Details" />
    <div class="container mx-auto px-6 pt-12 pb-20 md:pb-24">
      <div
        v-if="isLoading"
        class="dark:bg-darkBlue3 flex h-28 w-full items-center justify-center rounded-lg bg-gray-100 p-4"
      >
        <LoadingSpinner />
      </div>
      <ResultDetails v-if="!isLoading && details" :details="details" />
      <BackButton />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import AppLayout from '@/components/layout/AppLayout.vue'
import PageCover from '@/components/PageCover.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import BackButton from '@/components/BackButton.vue'
import ResultDetails from '@/components/scanner/ResultDetails.vue'
import { getBacktest } from '@/services/dataStorage'
import { useResultsStore } from '@/stores/results'

const route = useRoute()
const resultsStore = useResultsStore()
const { details } = storeToRefs(resultsStore)
const isLoading = ref(true)

async function loadDetails(id: number) {
  isLoading.value = true
  // Drop the previous stock so its name does not show in the cover while the next one loads.
  resultsStore.setDetails(null)
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

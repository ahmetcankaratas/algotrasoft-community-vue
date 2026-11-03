<template>
  <AppLayout>
    <template v-if="notFound">
      <PageCover header="Not Found" />
      <BackButton />
    </template>
    <template v-else-if="error">
      <PageCover header="Something went wrong" :description="error" />
      <BackButton />
    </template>
    <template v-else>
      <PageCover :header="details?.name" description="Result Details" />
      <div class="container mx-auto px-6 pt-12 pb-20 md:pb-24">
        <div
          v-if="isLoading"
          class="dark:bg-darkBlue3 flex h-28 w-full items-center justify-center rounded-lg bg-gray-100 p-4"
        >
          <LoadingSpinner />
        </div>
        <ResultDetails v-if="details" :details="details" />
        <BackButton />
      </div>
    </template>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import PageCover from '@/components/PageCover.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import BackButton from '@/components/BackButton.vue'
import ResultDetails from '@/components/scanner/ResultDetails.vue'
import { getBacktest } from '@/services/dataStorage'
import { useRequestStatus } from '@/composables/useRequestStatus'
import type { BacktestDetails } from '@/types/backtest'

const route = useRoute()
const details = ref<BacktestDetails | null>(null)
const { isLoading, error, run } = useRequestStatus()
const notFound = computed(() => !isLoading.value && !error.value && details.value === null)

async function loadDetails(id: number) {
  // Drop the previous stock so its name does not show in the cover while the next one loads.
  details.value = null
  await run(async () => {
    details.value = await getBacktest(id)
  })
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

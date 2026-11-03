<template>
  <div
    v-if="isLoading"
    class="dark:bg-darkBlue3 flex h-28 w-full items-center justify-center rounded-lg bg-gray-100 p-4"
  >
    <LoadingSpinner />
  </div>
  <RouterLink
    v-else-if="result"
    :to="`/scanner/${id - 1}`"
    class="dark:bg-darkBlue3 flex cursor-pointer flex-row justify-between rounded-lg bg-gray-100 p-10 duration-200 hover:scale-105"
  >
    <div class="group flex flex-col space-y-3">
      <p class="text-lg font-bold md:text-2xl">{{ result.name }}</p>
      <h4 class="md:text-md text-sm">{{ result.symbol }}</h4>
    </div>
    <div class="group flex flex-col space-y-3">
      <div class="md:text-md dark:bg-darkBlue1 rounded-xl bg-gray-300 p-1 px-3 text-sm">
        yearly apy
      </div>
      <h4
        class="text-md md:text-l text-center font-bold"
        :class="{
          'text-darkCyan': result.return_yearly_1 > 0,
          'text-red-500': result.return_yearly_1 < 0,
        }"
      >
        <span class="text-lg md:text-xl">%</span>
        {{ result.return_yearly_1.toFixed(0) }}
      </h4>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { getBacktest } from '@/services/dataStorage'
import type { BacktestDetails } from '@/types/backtest'

const props = defineProps<{ id: number }>()

const isLoading = ref(true)
const result = ref<BacktestDetails | null>(null)

async function loadResult() {
  try {
    // Stock ids start at 1 in the database while the backtest results are a zero-based array.
    result.value = await getBacktest(props.id - 1)
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

loadResult()
</script>

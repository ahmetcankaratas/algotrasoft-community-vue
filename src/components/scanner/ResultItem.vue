<template>
  <li class="mx-auto w-10/12">
    <RouterLink
      :to="`/scanner/${result.id - 1}`"
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
  </li>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { MarketResponseResult } from '@/types/market'

defineProps<{
  result: MarketResponseResult
}>()
</script>

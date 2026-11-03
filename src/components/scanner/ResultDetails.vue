<template>
  <div class="container mx-auto mt-[-5rem] w-full px-6 md:max-w-2xl">
    <div
      class="dark:bg-darkBlue3 flex flex-col justify-between space-y-4 rounded-lg bg-gray-100 p-10"
    >
      <InfoRow title="Sector" :description="details.sector" />
      <InfoRow title="Market" :description="details.market" />
      <InfoRow title="Market Cap" :description="details.market_cap" />
      <hr />
      <BarGraph description="1 Month Result" :value="details.return_monthly_1" />
      <BarGraph description="3 Month Result" :value="details.return_monthly_3" />
      <BarGraph description="6 Month Result" :value="details.return_monthly_6" />
      <BarGraph description="1 Year Result" :value="details.return_yearly_1" />
    </div>
  </div>
</template>

<script setup lang="ts">
import InfoRow from './InfoRow.vue'
import BarGraph from './BarGraph.vue'
import type { BacktestResponseResult } from '@/types/backtest'

defineProps<{
  details: BacktestResponseResult
}>()
</script>

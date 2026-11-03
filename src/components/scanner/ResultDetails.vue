<template>
  <div class="container mx-auto mt-[-5rem] w-full px-6 md:max-w-2xl">
    <div
      class="dark:bg-darkBlue3 flex flex-col justify-between space-y-4 rounded-lg bg-gray-100 p-10"
    >
      <InfoRow title="Sector" description="Basic Industries" />
      <InfoRow title="Market" description="NASDAQ" />
      <InfoRow title="Market Cap" description="$868.22M" />
      <hr />
      <BarGraph description="1 Month Result" :value="6.3" />
      <BarGraph description="3 Month Result" :value="20.9" />
      <BarGraph description="6 Month Result" :value="17.1" />
      <BarGraph description="1 Year Result" :value="-6.5" />
    </div>
  </div>
</template>

<script setup lang="ts">
import InfoRow from './InfoRow.vue'
import BarGraph from './BarGraph.vue'
</script>

<template>
  <div
    class="grid grid-cols-2 items-center space-y-1 duration-200 hover:underline hover:underline-offset-4"
  >
    <div class="dark:bg-darkBlue1 w-[10rem] rounded-xl bg-gray-300 p-1 px-3 text-sm">
      {{ description }}
    </div>
    <div class="flex items-center">
      <div class="h-4 w-full rounded-xl bg-gray-200 p-1">
        <div class="h-full rounded-xl p-1" :class="barColor" :style="{ width: `${width}%` }"></div>
      </div>
      <div class="ml-2 w-8 text-right text-sm">{{ value.toFixed(0) }}%</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    value?: number
    description?: string
  }>(),
  { value: 0, description: 'n/a' },
)

const width = computed(() => Math.min(100, Math.abs(props.value)))
const barColor = computed(() => (props.value < 0 ? 'bg-red-500' : 'bg-darkCyan'))
</script>

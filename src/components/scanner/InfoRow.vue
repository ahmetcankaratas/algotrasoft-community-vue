<template>
  <div
    class="grid grid-cols-2 items-center space-y-1 duration-200 hover:underline hover:underline-offset-4"
  >
    <div class="dark:bg-darkBlue1 w-[10rem] rounded-xl bg-gray-300 p-1 px-3 text-sm">
      {{ title }}
    </div>
    <div class="flex items-center">{{ displayedDescription }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const NOT_AVAILABLE = 'Not Available'

const props = withDefaults(
  defineProps<{
    title?: string
    description?: string
  }>(),
  { title: NOT_AVAILABLE, description: NOT_AVAILABLE },
)

const displayedDescription = computed(() =>
  props.description.toLowerCase() === 'n/a' ? NOT_AVAILABLE : props.description,
)
</script>

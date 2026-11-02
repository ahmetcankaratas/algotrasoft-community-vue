<template>
  <div
    class="bg-scanner-cover-light dark:bg-scanner-cover flex h-96 w-full items-center justify-center bg-center bg-no-repeat"
  >
    <div class="space-y-5 text-center">
      <h1 class="bold mx-7 text-4xl md:text-6xl">{{ header }}</h1>
      <p class="text-darkCyan px-5 text-lg font-bold md:text-xl">
        {{ description }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  header?: string
  description?: string
}>()
</script>

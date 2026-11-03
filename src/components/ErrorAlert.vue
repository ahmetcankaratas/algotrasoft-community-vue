<template>
  <div
    role="alert"
    class="my-4 rounded-lg bg-red-300 px-5 py-2.5 text-center text-sm font-medium text-white"
  >
    <p>{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message: string
}>()
</script>

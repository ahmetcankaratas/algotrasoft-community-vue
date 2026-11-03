<template>
  <div class="container mx-auto mb-10 w-full px-6 md:max-w-2xl">
    <button
      type="button"
      class="text-md hover:bg-darkCyan dark:bg-darkBlue1 dark:hover:bg-accentCyan mt-2 w-full cursor-pointer rounded-xl bg-gray-300 p-3 text-center md:max-w-2xl md:text-lg"
      @click="router.back()"
    >
      Back
    </button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

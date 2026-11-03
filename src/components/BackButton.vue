<template>
  <div class="container mx-auto mb-10 w-full px-6 md:max-w-2xl">
    <button
      type="button"
      class="text-md hover:bg-darkCyan dark:bg-darkBlue1 dark:hover:bg-accentCyan mt-2 w-full cursor-pointer rounded-xl bg-gray-300 p-3 text-center md:max-w-2xl md:text-lg"
      @click="goBack"
    >
      Back
    </button>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// Navigates to the parent route record (e.g. /scanner/0 -> /scanner) instead of relying on the
// browser history, so the button also works when the page was opened directly. Falls back to home.
function goBack() {
  const parent = route.matched[route.matched.length - 2]
  router.push(parent ? parent.path : '/')
}
</script>

<template>
  <ul
    class="scrollbar scrollbar-thumb-darkCyan mt-8 flex max-h-screen w-full scrollbar-track-gray-300 flex-col space-y-8 overflow-y-scroll dark:scrollbar-track-white"
  >
    <ResultItem v-for="result in results" :key="result.id" :result="result" />
  </ul>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import ResultItem from './ResultItem.vue'
import { useResultsStore } from '@/stores/results'

const { results } = storeToRefs(useResultsStore())
</script>

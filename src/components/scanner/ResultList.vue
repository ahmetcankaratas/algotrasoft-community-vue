<template>
  <ul
    class="scrollbar scrollbar-thumb-darkCyan mt-8 flex max-h-screen w-full scrollbar-track-gray-300 flex-col space-y-8 overflow-y-scroll dark:scrollbar-track-white"
  >
    <li
      v-for="stock in filteredResults"
      :key="stock.id"
      v-observe-visibility="{ onVisible: () => markVisible(stock.id), debounce: 300 }"
      class="mx-auto w-10/12"
    >
      <ResultItem v-if="visible[stock.id]" :id="stock.id" />
    </li>
  </ul>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import ResultItem from './ResultItem.vue'
import { useResultsStore } from '@/stores/results'
import { filterByProperty } from '@/utils/filter'
import { vObserveVisibility } from '@/directives/observeVisibility'

const props = withDefaults(defineProps<{ query?: string }>(), { query: '' })

const { results } = storeToRefs(useResultsStore())
const filteredResults = computed(() => filterByProperty(results.value, props.query, 'name'))

// Items are only created (and their details fetched) once their slot has scrolled into view.
const visible = reactive<Record<number, boolean>>({})

function markVisible(id: number) {
  visible[id] = true
}
</script>

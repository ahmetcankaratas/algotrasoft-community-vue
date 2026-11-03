<template>
  <div class="px-6 md:px-0">
    <div
      class="dark:bg-darkBlue1 container mx-auto max-w-4xl space-y-6 rounded-lg bg-gray-200 p-10 px-6 text-center md:px-16"
    >
      <h5 class="text-2xl font-bold">Search</h5>
      <div class="w-full md:flex-1">
        <input
          v-model="query"
          type="text"
          class="w-full rounded-full bg-white px-10 py-3 focus:outline-none dark:text-black"
          placeholder="Enter Stock Name"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const query = defineModel<string>({ default: '' })
</script>

<template>
  <AppLayout>
    <PageCover header="Scanner" description="Backtesting Results of Ross Hook Trading Strategy" />
    <div class="container mx-auto px-6 pt-12 pb-20 md:pb-24">
      <div
        v-if="isLoading"
        class="dark:bg-darkBlue3 flex h-28 w-full items-center justify-center rounded-lg bg-gray-100 p-4"
      >
        <LoadingSpinner />
      </div>
      <ResultDetails />
      <BackButton />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import PageCover from '@/components/PageCover.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import BackButton from '@/components/BackButton.vue'
import ResultDetails from '@/components/scanner/ResultDetails.vue'

const isLoading = ref(false)
</script>

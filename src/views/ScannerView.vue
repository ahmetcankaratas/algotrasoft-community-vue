<template>
  <AppLayout>
    <PageCover header="Scanner" description="Backtesting Results of Ross Hook Trading Strategy" />
    <ScannerSearch />
    <ResultList />
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '@/components/layout/AppLayout.vue'
import PageCover from '@/components/PageCover.vue'
import ScannerSearch from '@/components/scanner/ScannerSearch.vue'
import ResultList from '@/components/scanner/ResultList.vue'
</script>

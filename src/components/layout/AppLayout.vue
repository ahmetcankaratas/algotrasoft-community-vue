<template>
  <div
    class="layout-container font-opensans dark:bg-darkBlue mx-auto min-h-screen w-full py-2 dark:text-white"
  >
    <div class="layout-header">
      <slot name="header">
        <AppHeader />
      </slot>
    </div>
    <div class="layout-body">
      <slot />
    </div>
    <div class="layout-footer">
      <slot name="footer">
        <AppFooter />
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppHeader from './AppHeader.vue'
import AppFooter from './AppFooter.vue'
</script>

<style scoped>
.layout-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.layout-body {
  margin: auto 0;
}
</style>

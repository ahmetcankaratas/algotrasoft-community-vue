<template>
  <RouterView />
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const { isAuthenticated } = storeToRefs(useAuthStore())

watch(isAuthenticated, (authenticated) => {
  if (!authenticated) {
    router.push('/auth/login')
  }
})
</script>

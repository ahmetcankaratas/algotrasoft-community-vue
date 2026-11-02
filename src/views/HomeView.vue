<template>
  <AppLayout>
    <HomeParticles />
    <HomeHero />
    <HomeAbout />
    <HomeWork />
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '@/components/layout/AppLayout.vue'
import HomeParticles from '@/components/home/HomeParticles.vue'
import HomeHero from '@/components/home/HomeHero.vue'
import HomeAbout from '@/components/home/HomeAbout.vue'
import HomeWork from '@/components/home/HomeWork.vue'
</script>

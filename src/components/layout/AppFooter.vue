<template>
  <footer class="bg-darkBlue2 relative z-10 text-white">
    <div class="container mx-auto px-5 pt-12 pb-10">
      <div class="flex flex-col justify-between space-y-24 md:flex-row md:space-y-0">
        <div class="flex items-center space-x-3">
          <div class="w-6">
            <img src="@/assets/images/icon-email.svg" alt="" class="scale-10" />
          </div>
          <div>algotrasoft@gmail.com</div>
        </div>

        <div
          class="flex flex-col space-y-10 text-xl md:flex-row md:space-y-0 md:space-x-20 md:text-base"
        >
          <div class="f-nav flex flex-col space-y-3">
            <RouterLink to="/#navbar">Home</RouterLink>
            <RouterLink to="/#about-us">About Us</RouterLink>
            <RouterLink to="/#work">How We Work</RouterLink>
          </div>
          <div class="f-nav flex flex-col space-y-3">
            <RouterLink to="/scanner#scanner">Scanner</RouterLink>
            <RouterLink to="/contact">Contact</RouterLink>
          </div>
        </div>

        <div class="flex justify-center pb-10">
          <a href="https://tr.linkedin.com/company/algotrasoft" target="_blank" rel="noreferrer">
            <img src="@/assets/images/linkedin.svg" alt="" class="ficon invert" />
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

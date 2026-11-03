<template>
  <header id="navbar" class="container mx-auto mt-10 h-40 px-6 text-center md:h-20">
    <div
      class="top-12 right-12 hidden items-center justify-center space-x-4 sm:flex md:absolute md:space-x-10"
    >
      <RouterLink to="/" class="hover:text-accentCyan">Home</RouterLink>
      <RouterLink to="/contact" class="hover:text-accentCyan tracking-widest">Contact</RouterLink>
      <span>|</span>
      <RouterLink
        v-if="!isAuthenticated"
        to="/auth/login"
        class="hover:text-accentCyan tracking-widest"
        >Login</RouterLink
      >
      <button
        v-else
        type="button"
        class="hover:text-accentCyan tracking-widest hover:cursor-pointer"
        @click="onLogout"
      >
        Logout
      </button>
      <RouterLink
        v-if="!isAuthenticated"
        to="/auth/signup"
        active-class=""
        exact-active-class=""
        class="bg-darkCyan hover:bg-accentCyan rounded-full px-8 py-3 tracking-widest hover:opacity-70"
        >Sign Up</RouterLink
      >
      <RouterLink
        v-else
        to="/scanner"
        active-class=""
        exact-active-class=""
        class="bg-darkCyan hover:bg-accentCyan rounded-full px-8 py-3 tracking-widest hover:opacity-70"
        >Scanner</RouterLink
      >
      <ThemeToggle class="p-2" />
    </div>

    <HamburgerButton v-model="isMenuOpen" class="float-right block sm:hidden" />
    <ThemeToggle class="float-left block p-0 sm:hidden" />

    <div
      v-if="isMenuOpen"
      id="menu"
      class="bg-darkBlue absolute top-20 right-6 left-6 z-10 h-3/4 rounded-lg p-6 dark:bg-white"
    >
      <div
        class="flex w-full flex-col items-center justify-center space-y-6 rounded font-bold text-white dark:text-black"
      >
        <RouterLink to="/" class="hover:text-accentCyan w-full">Home</RouterLink>
        <RouterLink to="/contact" class="hover:text-accentCyan w-full tracking-widest"
          >Contact</RouterLink
        >
        <RouterLink
          v-if="!isAuthenticated"
          to="/auth/login"
          class="hover:text-accentCyan w-full border-t border-gray-400 pt-6 text-center tracking-widest"
          >Login</RouterLink
        >
        <button
          v-else
          type="button"
          class="hover:text-accentCyan w-full border-t border-gray-400 pt-6 text-center tracking-widest hover:cursor-pointer"
          @click="onLogout"
        >
          Logout
        </button>
        <RouterLink
          v-if="!isAuthenticated"
          to="/auth/signup"
          active-class=""
          exact-active-class=""
          class="bg-darkCyan hover:bg-accentCyan w-full rounded-full px-8 py-3 tracking-widest hover:opacity-70"
          >Sign Up</RouterLink
        >
        <RouterLink
          v-else
          to="/scanner"
          active-class=""
          exact-active-class=""
          class="bg-darkCyan hover:bg-accentCyan w-full rounded-full px-8 py-3 tracking-widest hover:opacity-70"
          >Scanner</RouterLink
        >
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import ThemeToggle from './ThemeToggle.vue'
import HamburgerButton from './HamburgerButton.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const { isAuthenticated } = storeToRefs(authStore)
const isMenuOpen = ref(false)

function onLogout() {
  authStore.logout()
}
</script>

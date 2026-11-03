<template>
  <AppLayout>
    <section id="login" class="dark:bg-darkBlue bg-gray-50">
      <div class="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
        <ErrorAlert v-if="error" :message="error" />
        <div v-if="isLoading">
          <LoadingSpinner />
        </div>
        <div
          v-if="!isLoading"
          class="w-full rounded-lg bg-white shadow sm:max-w-md md:mt-0 xl:p-0 dark:border dark:border-gray-700 dark:bg-gray-800"
        >
          <div class="space-y-4 p-6 sm:p-8 md:space-y-6">
            <h1
              class="text-xl leading-tight font-bold tracking-tight text-gray-900 md:text-2xl dark:text-white"
            >
              Login to your account
            </h1>
            <form class="space-y-4 md:space-y-6" novalidate @submit.prevent="onSubmit">
              <div>
                <label
                  for="email"
                  class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >Your email</label
                >
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  name="email"
                  class="focus:border-primary-600 focus:ring-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  :class="{ warning: (errors.email && touched.email) || invalidSubmit }"
                  placeholder="name@example.com"
                  required
                  @blur="touched.email = true"
                />
                <small v-if="errors.email && touched.email" class="text-red-600"
                  >Please enter a valid email!</small
                >
              </div>
              <div>
                <label
                  for="password"
                  class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >Password</label
                >
                <input
                  id="password"
                  v-model="form.password"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  class="focus:border-primary-600 focus:ring-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  :class="{ warning: (errors.password && touched.password) || invalidSubmit }"
                  required
                  @blur="touched.password = true"
                />
                <small v-if="errors.password && touched.password" class="text-red-600"
                  >Must contain at least one number and one letter, and at least 6 or more
                  characters</small
                >
              </div>
              <div class="flex items-center justify-between">
                <RouterLink
                  to="/auth/signup"
                  class="text-primary-600 dark:text-primary-500 text-sm font-medium hover:underline"
                  >Forgot password?</RouterLink
                >
              </div>
              <button
                type="submit"
                class="bg-primary-600 hover:bg-primary-700 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 w-full rounded-lg px-5 py-2.5 text-center text-sm font-medium text-white focus:ring-4 focus:outline-none"
              >
                Login
              </button>
              <small v-if="invalidSubmit" class="text-red-600">Please fill all areas</small>
              <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                Don’t have an account yet?
                <RouterLink
                  to="/auth/signup"
                  class="text-primary-600 dark:text-primary-500 font-medium hover:underline"
                  >Sign Up</RouterLink
                >
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ErrorAlert from '@/components/ErrorAlert.vue'
import { useAuthStore } from '@/stores/auth'
import { useRequestStatus } from '@/composables/useRequestStatus'
import { isEmail, isPassword } from '@/utils/validation'

const router = useRouter()
const authStore = useAuthStore()

const emptyForm = () => ({ email: '', password: '' })
const untouched = () => ({ email: false, password: false })

const form = reactive(emptyForm())
const touched = reactive(untouched())
const invalidSubmit = ref(false)
const { isLoading, error, run } = useRequestStatus()

const errors = computed(() => ({
  email: !isEmail(form.email),
  password: !isPassword(form.password),
}))

const isValid = computed(() => !Object.values(errors.value).some(Boolean))

async function onSubmit() {
  if (!isValid.value) {
    invalidSubmit.value = true
    return
  }

  invalidSubmit.value = false
  const { email, password } = form
  Object.assign(form, emptyForm())
  Object.assign(touched, untouched())

  await run(async () => {
    await authStore.login(email, password)
    await router.push('/scanner')
  })
}
</script>

import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Particles from '@tsparticles/vue3'
import { loadFull } from 'tsparticles'

import App from './App.vue'
import router from './router'
import { installTokenInterceptor } from './services/tokenInterceptor'
import { useAuthStore } from './stores/auth'
import { useThemeStore } from './stores/theme'

const app = createApp(App)

app.use(createPinia())
// Restore the stored session before the router resolves the first route and runs its guards.
useAuthStore().autoLogin()
useThemeStore().initTheme()
installTokenInterceptor()
app.use(router)
app.use(Particles, {
  init: async (engine) => {
    await loadFull(engine)
  },
})

app.mount('#app')

import './assets/main.css'
import { createSSRApp, type App } from 'vue'
import VueApp from './App.vue'

import { createPinia, type Pinia } from 'pinia'
import { createRouter } from './router'
import type { Router } from 'vue-router'

interface AppModules {
    app: App<Element>
    pinia: Pinia
    router: Router
}

export function createApp(): AppModules {
    const app = createSSRApp(VueApp)
    const pinia = createPinia()
    const router = createRouter()

    app.use(pinia)
    app.use(router)

    return { app, pinia, router }
}

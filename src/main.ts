import './assets/main.css'
import { createSSRApp, type App } from 'vue'
import { createPinia } from 'pinia'
import app from './App.vue'
import { createRouter } from './router'

export function createApp(): { app: App<Element> } {
    const ssrApp = createSSRApp(app)
    ssrApp.use(createPinia())
    ssrApp.use(createRouter())
    return { app: ssrApp }
}

createApp().app.mount('#app')

import { createApp } from './main'

const { app, router } = createApp()
await router.isReady()
app.mount('#app')

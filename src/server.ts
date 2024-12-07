import fs from 'fs'
import path, { resolve } from 'path'
import express from 'express'
// import cors from 'cors'
import dotenv from 'dotenv'
import { createSSRApp } from 'vue'
import { createServer as createViteServer } from 'vite'
import { renderToString as _renderToString } from 'vue/server-renderer'
import { fileURLToPath } from 'url'
import type { Router } from 'vue-router'

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function createServer() {
    const app = express()
    const port = process.env.PORT || 5173
    const vite = await createViteServer({
        root: resolve('.'),
        server: { middlewareMode: true },
        appType: 'custom',
    })

    const renderToString = async (url: string) => {
        const { default: App } = await vite.ssrLoadModule('/src/App.vue')
        const { createRouter } = await vite.ssrLoadModule('/src/router/index.ts')
        const { createPinia } = await vite.ssrLoadModule('src/stores/index.ts')

        const app = createSSRApp(App)
        const router: Router = createRouter()
        const pinia = createPinia()

        app.use(router)
        app.use(pinia)

        router.push(url)
        await router.isReady()
        const html = await _renderToString(app, {})
        return { html }
    }

    app.use(vite.middlewares)
    //app.use(cors({ origin: '*' }))
    app.use('*', async (req, res) => {
        const url = req.originalUrl || req.url
        let template = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf-8')
        template = await vite.transformIndexHtml(url, template)

        const { html: renderedHtml } = await renderToString(url)

        const html = template.replace('<div id="app"></div>', `<div id="app">${renderedHtml}</div>`)
        res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    })

    app.listen(port, () => {
        console.log(`[server]: Server is running at http://localhost:${port}`)
    })
}

createServer()

import fs from 'node:fs/promises'
import express from 'express'
import dotenv from 'dotenv'
import type { ViteDevServer } from 'vite'

dotenv.config()

const isProduction = process.env.NODE_ENV === 'production'

const app = express()
const port = process.env.PORT || 5173
const base = process.env.BASE || '/'

const templateHtml = isProduction ? await fs.readFile('./dist/client/index.html', 'utf-8') : ''

let vite: ViteDevServer

if (!isProduction) {
    const { createServer } = await import('vite')
    vite = await createServer({
        server: { middlewareMode: true },
        appType: 'custom',
        base,
    })
    app.use(vite.middlewares)
} else {
    const sirv = (await import('sirv')).default
    app.use(base, sirv('./dist/client', { extensions: [] }))
}

app.use('*', async (req, res, next) => {
    const url = (req.originalUrl || req.url).replace(base, '')

    let template: string
    let render: (url: string) => Promise<{ html: string }>
    try {
        if (!isProduction) {
            template = await fs.readFile('./index.html', 'utf-8')
            template = await vite.transformIndexHtml(url, template)

            render = (await vite.ssrLoadModule('/src/entry-server.ts')).render
        } else {
            template = templateHtml
            render = (await import('./dist/server/entry-server.js')).render
        }

        const rendered = await render(url)
        const html = template.replace(`<!--app-html-->`, rendered.html ?? '')

        res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
        vite?.ssrFixStacktrace(e as Error)
        next(e)
    }
})

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`)
})

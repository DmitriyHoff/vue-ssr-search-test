import fs from 'node:fs/promises'
import express, { type Request, type Response, type Express } from 'express'
import dotenv from 'dotenv'
import type { ViteDevServer } from 'vite'

dotenv.config()

const isProduction: boolean = process.env.NODE_ENV === 'production'

const app: Express = express()
const port: string = process.env.PORT || '5173'
const base: string = process.env.BASE || '/'

let templateHtml: string
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
    templateHtml = await fs.readFile('./dist/client/index.html', 'utf-8')
    const sirv = (await import('sirv')).default
    app.use(base, sirv('./dist/client', { extensions: [] }))
}

app.use('*', async (req: Request, res: Response, next) => {
    const url = (req.originalUrl || req.url).replace(base, '')

    let render: (url: string) => Promise<{ html: string }>
    try {
        if (!isProduction) {
            templateHtml = await fs.readFile('./index.html', 'utf-8')
            templateHtml = await vite.transformIndexHtml(url, templateHtml)
            render = (await vite.ssrLoadModule('/src/entry-server.ts')).render
        } else {
            const importURL = new URL('./dist/server/entry-server.js', import.meta.url)
            render = (await import(importURL.toString())).render
        }

        const rendered = await render(url)
        const html = templateHtml.replace(`<!--app-html-->`, rendered.html ?? '')

        res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
        vite?.ssrFixStacktrace(e as Error)
        next(e)
    }
})

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`)
})

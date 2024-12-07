import { fileURLToPath, URL } from 'node:url'

import { defineConfig, UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

function getConfig(): UserConfig {
    const buildTarget = process.env.BUILD_TARGET

    const baseConfig: UserConfig = {
        plugins: [vue(), vueDevTools()],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
            },
        },
    }

    // Build-specific options
    console.log({ buildTarget })
    if (buildTarget === 'client') {
        return {
            ...baseConfig,
            build: {
                outDir: 'dist/client',
            },
        }
    } else if (buildTarget === 'server') {
        return {
            ...baseConfig,
            publicDir: false,
            build: {
                ssr: 'src/server.ts',
                outDir: 'dist/server',
            },
        }
    } else {
        return baseConfig
    }
}
// https://vite.dev/config/
export default defineConfig(getConfig())

import { fileURLToPath, URL } from 'node:url'
import { defineConfig, type UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

const buildTarget = process.env.BUILD_TARGET

const baseConfig: UserConfig = {
    plugins: [vue(), vueDevTools()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    build: {
        target: 'esnext',
    },
}

function getConfig(): UserConfig {
    // Build-specific options
    switch (buildTarget) {
        case 'client':
            return {
                ...baseConfig,
                build: {
                    ...baseConfig.build,
                    outDir: 'dist/client',
                },
            }
        case 'server':
            return {
                ...baseConfig,
                publicDir: false,
                build: {
                    ...baseConfig.build,
                    ssr: true,
                    outDir: 'dist',
                    rollupOptions: {
                        input: 'server.ts',
                    },
                },
            }
        default:
            return baseConfig
    }
}

// https://vite.dev/config/
export default defineConfig(getConfig())

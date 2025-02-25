import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'
import dts from 'vite-plugin-dts'

export default defineConfig({
    define: {
        'process.env': {}
    },
    plugins: [
        vue(),
        svgLoader(),
        dts({
            rollupTypes: true,
            copyDtsFiles: true
        }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            root: fileURLToPath(new URL('./', import.meta.url))
        }
    },
    build: {
        lib: {
            entry: './src/main-old.ts',
            name: 'OpenSIPSWidget',
            fileName: (format) => `opensipsjs-widget.${format}.js`
        },
        rollupOptions: {
            output: {
                globals: {
                    vue: 'Vue'
                }
            }
        }
    }
})

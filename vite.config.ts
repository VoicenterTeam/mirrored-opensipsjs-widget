import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
    define: {
        'process.env': {}
    },
    plugins: [
        vue(),
        svgLoader(),
        viteStaticCopy({
            targets: [
                {
                    src: 'src/types/*',
                    dest: 'types'
                }
            ]
        })
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            'root': fileURLToPath(new URL('./', import.meta.url))
        }
    },
    build: {
        lib: {
            entry: './src/main.ts',
            name: 'OpenSIPSWidget',
            fileName: (format) => `opensips-widget.${format}.js`
        },
    }
})

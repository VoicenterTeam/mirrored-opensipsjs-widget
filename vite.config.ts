import { defineConfig } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import htmlPlugin from 'vite-plugin-html-config'
import { version } from './package.json'
import {fileURLToPath, URL} from "node:url";

export default defineConfig({
    plugins: [
        vue(),
        htmlPlugin({
            title: `Call History v${version}`
        })
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            root: path.resolve(__dirname, './')
        }
    },
    build: {
        modulePreload: false,
        cssCodeSplit: false
    }
})

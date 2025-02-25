import { defineConfig } from 'vite'
import path, { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import selectorReplace from 'postcss-selector-replace'
import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss'
import svgLoader from 'vite-svg-loader'

// eslint-disable-next-line quotes
const define = "'production'"

const widgetBuild = {
    outDir: 'widget',
    copyPublicDir: false,
    sourcemap: true,
    modulePreload: true,
    cssCodeSplit: false,
    commonjsOptions: {
        esmExternals: true
    },
    lib: {
        entry: './src/widget.ce.ts',
        name: 'OpenSIPSWidget',
        fileName: 'opensipsjs-widget',
        // formats: [ 'es', 'umd' ], // Support ES module and UMD
    },
    rollupOptions: {
        input: {
            main: resolve(__dirname, 'index.html')
        },
    },
}

const plugins =  [
    vue({
        features: {
            customElement: true,
        },
        template: {
            compilerOptions: {
                // Enable custom elements
                isCustomElement: (tag) => tag.startsWith('opensips-widget'),
            }
        },
    }),
    svgLoader(),
]

const cssConfigs ={
    postcss: {
        plugins: [
            /*selectorReplace({
                before: [ ':root' ],
                after: [ ':host' ]
            }),*/
            tailwindcss(),
            autoprefixer({})
        ]
    }
}

export default defineConfig({
    define: { 'process.env.NODE_ENV': define },
    plugins: [ ...plugins ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    },
    build: widgetBuild,
    server: {
        watch: {
            usePolling: true,
        },
        open: '/index',
        // open: isWidgetBuild ? 'widget.html' : 'index.html'
    },
    css: cssConfigs
})

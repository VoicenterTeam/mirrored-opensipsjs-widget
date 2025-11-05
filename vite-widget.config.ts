import { CSSOptions, BuildOptions, defineConfig } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import selectorReplace from 'postcss-selector-replace'
import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss'
import svgLoader from 'vite-svg-loader'
import dts from 'vite-plugin-dts'

// eslint-disable-next-line quotes
const define = "'production'"

const widgetBuild: BuildOptions = {
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
        formats: [ 'es', 'umd' ], // Support ES module and UMD
    },
    rollupOptions: {
        output: {
            manualChunks: undefined, // Disable automatic chunking
            inlineDynamicImports: true // Inline dynamic imports instead of splitting
        }
    }
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
    dts({
        rollupTypes: true,
        copyDtsFiles: false,
        staticImport: true,
        insertTypesEntry: true,
        entryRoot: './src',
        outDir: 'widget',
        strictOutput: true,
        pathsToAliases: true
    }),
]

const cssConfigs: CSSOptions ={
    postcss: {
        plugins: [
            selectorReplace({
                before: [ ':root' ],
                after: [ ':host' ]
            }),
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

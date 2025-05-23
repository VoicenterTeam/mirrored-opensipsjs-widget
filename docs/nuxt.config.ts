// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from 'path'

export default defineNuxtConfig({
    devtools: { enabled: true },

    app: {
        head: {
            meta: [
                {
                    name: 'theme-color',
                    content: '#e31515'
                },
                {
                    name: 'apple-mobile-web-app-capable',
                    content: 'yes'
                },
                {
                    name: 'apple-mobile-web-app-status-bar-style',
                    content: '#e31515'
                }
            ],
            link: [
                {
                    rel: 'icon',
                    href: '/favicon.ico'
                }
            ]
        }
    },

    extends: [
        [ 'github:VoicenterTeam/documentation-template', { install: true } ]
    ],

    /*uiTypedoc: {
      typesGenerate: true,
      entryPoints: [ resolve(__dirname, '../dist/opensipsjs-widget.d.ts') ]
  },*/

    css: [
        '@voicenter-team/voicenter-ui-plus/library/style.css',
        './assets/css/tailwind.css'
    ],

    alias: {
        '@': resolve(__dirname, '../src'),
        root: resolve(__dirname, '../')
    },

    compatibilityDate: '2024-12-16'
})

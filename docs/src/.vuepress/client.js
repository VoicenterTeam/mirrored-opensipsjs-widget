import { defineClientConfig } from '@vuepress/client'
import ElementPlus from 'element-plus'
import './styles/index.scss'

export default defineClientConfig({
    enhance({ app, router, siteData }) {
        app.use(ElementPlus)
    },
    setup() {},
    rootComponents: [],
})

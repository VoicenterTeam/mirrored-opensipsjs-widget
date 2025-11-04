import { defineCustomElement } from 'vue'
import OpenSIPSWidgetComponent from '@/widget/OpenSIPSWidget.ce.vue'
import UI from '@voicenter-team/voicenter-ui-plus'
import styles1 from '@voicenter-team/voicenter-ui-plus/library/style.css?inline'
import styles2 from '@/styles/style.scss?inline'
import VLoading from 'v-loading-directive'

// Export all public types and API
export type * from '@/types/public-api'
export { default as OpenSIPSExternalWidgetAPI } from '@/widget/OpenSIPSExternalWidgetAPI'

const widget = defineCustomElement(OpenSIPSWidgetComponent, {
    configureApp (app) {
        app.use(UI, {
            entityComponentsEnabled: false,
            themeConfig: {
                type: 'local',
                themeName: 'blue'
            },
            injectIconFont: true
        })
            .directive('loading', VLoading)
    },
    styles: [ styles1, styles2 ],
})

customElements.define('opensips-widget', widget)

export { widget as OpenSIPSWidgetConstructor }

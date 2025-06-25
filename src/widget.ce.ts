import { defineCustomElement } from 'vue'
import OpenSIPSWidgetComponent from '@/widget/OpenSIPSWidget.ce.vue'
import UI from '@voicenter-team/voicenter-ui-plus'
import styles1 from '@voicenter-team/voicenter-ui-plus/library/style.css?inline'
import styles2 from '@/styles/style.scss?inline'
import { ActiveTabPlugin } from '@/plugins/activeTabPlugin'
import VLoading from 'v-loading-directive'

export * from '@/types/public-api.d'

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
            .use(ActiveTabPlugin)
            .directive('loading', VLoading)
    },
    styles: [ styles1, styles2 ],
})

customElements.define('opensips-widget', widget)

export { widget as OpenSIPSWidgetConstructor }

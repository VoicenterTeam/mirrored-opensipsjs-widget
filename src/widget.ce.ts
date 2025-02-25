import { defineCustomElement } from 'vue'
import OpenSIPSWidget from '@/widget/OpenSIPSWidget.ce.vue'
import UI from '@voicenter-team/voicenter-ui-plus'
import styles1 from '@voicenter-team/voicenter-ui-plus/library/style.css?inline'
import styles2 from '@/styles/style.scss?inline'
import { ActiveTabPlugin } from '@/plugins/activeTabPlugin'
import VLoading from 'v-loading-directive'

const widget = defineCustomElement(OpenSIPSWidget, {
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
    //shadowRoot: false
})

customElements.define('opensips-widget', widget)

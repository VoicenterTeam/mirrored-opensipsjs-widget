import { createApp } from 'vue'
import '@voicenter-team/voicenter-ui-plus/library/style.css'
//import './styles/style.css'
import App from './App.vue'

/* UI */
import UI from '@voicenter-team/voicenter-ui-plus'
import Popper from 'vue3-popper'
import VLoading from 'v-loading-directive'

const app = createApp(App)

app
    .use(UI, {
        entityComponentsEnabled: false,
        themeConfig: {
            type: 'local',
            themeName: 'red'
        },
        injectIconFont: true
    })
    .component('Popper', Popper)
    .directive('loading', VLoading)

app.mount('#app')

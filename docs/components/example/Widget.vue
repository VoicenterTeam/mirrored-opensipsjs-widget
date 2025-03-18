<template>
    <div
        ref="wrapperRef"
    />
</template>

<script lang="ts" setup>
// If dev
// import '../../../widget/opensipsjs-widget.umd'
import { version } from 'root/package.json'
import { onMounted, ref, onBeforeUnmount, watch } from 'vue'
import type {
    IWidgetConfig,
    IWidgetExternalAPI,
} from '@/types/public-api'
import type { OpenSIPSWidget } from '@/widget/OpenSIPSWidget'
import { useLocalStorage } from '@vueuse/core'
import { WIDGET_CONFIG_STORAGE_KEY } from '~/enum/storage.enum'
import { getDefaultWidgetConfig } from '@/enum/defaultWidgetConfig.enum'

/* Data */
const widgetConfig = useLocalStorage<IWidgetConfig>(
    WIDGET_CONFIG_STORAGE_KEY,
    getDefaultWidgetConfig()
)
const wrapperRef = ref<HTMLElement | null>(null)
let widgetEl: OpenSIPSWidget
let widgetAPI: IWidgetExternalAPI

/* Emits */
const emit = defineEmits<{
    (e: 'widget-api-init', payload: IWidgetExternalAPI): void
}>()

/* Methods */
function init () {
    if (!wrapperRef.value) {
        return
    }

    console.log('in init')

    if (!customElements.get('opensips-widget')) {
        const script = document.createElement('script')
        script.src = `https://cdn.opensipsjs.org/opensipsjs-widget/v${version}/opensipsjs-widget.umd.js`
        script.type = 'module'

        document.body.appendChild(script)
    }

    widgetEl = document.createElement('opensips-widget') as OpenSIPSWidget

    widgetEl.addEventListener(
        'widget:ready',
        ({ detail: OpenSIPSWidget }) => {
            widgetAPI = new OpenSIPSWidget(widgetConfig.value)


            emit('widget-api-init', widgetAPI)
        }
    )

    widgetEl.style.zIndex = '99999'

    wrapperRef.value.appendChild(widgetEl)
}

onMounted(init)
onBeforeUnmount(() => {
    if (widgetEl) {
        widgetEl.remove()
    }
})

/* Watch */
watch(
    widgetConfig,
    (config) => {
        if (widgetAPI) {
            console.log('Setting config', config)
            widgetAPI.setConfig(config)
        }
    },
    {
        deep: true,
        immediate: true
    }
)
</script>

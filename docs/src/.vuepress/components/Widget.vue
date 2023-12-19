<template>
    <div
       ref="wrapperRef"
    />
</template>

<script lang="ts" setup>
import 'root'
import { onMounted, ref } from 'vue'
import {
    IWidgetExternalAPI,
    TWidgetConfigOptions
} from '@/types/public-api'
import type { OpenSIPSWidgetElement } from '@/types/opensips-widget'
import { defaultRingingSound } from '@/utils/ringingSound'

/* Data */
const widgetAPI = ref<null | IWidgetExternalAPI>()
const wrapperRef = ref(null)

/* Emits */
const emit = defineEmits(['widget-api-init'])

/* Methods */
function init () {
    if (!wrapperRef.value) {
        return
    }

    const widgetEl = document.createElement('opensips-widget') as OpenSIPSWidgetElement

    widgetEl.addEventListener('widget:ready', ({ detail: OpenSIPSWidget }) => {
        const config: TWidgetConfigOptions = {
            callSettings: {
                allowTransfer: true,
                autoAnswer: {
                    allowChange: true,
                    defaultBehavior: false
                },
                outgoingCalls: true,
                callerInfo: {
                    displayName: true,
                    callerId: {
                        display: true,
                        mask: false
                    }
                },
                shrinkOnIdle: false,
                ringingSound: defaultRingingSound,
                outgoingCallPlaceHolder: 'Enter number'
            },
            themeSettings: {
                colors: {
                    primary: '#5E95E8',
                    secondary: '#0d8099',
                    'main-text': '#414C59',
                    'secondary-text': '#8292A5',
                    'button-pressed-text': '#FFF',
                    'border-lines': '#DDD',
                    'primary-bg': '#FFF',
                    'secondary-bg': '#F0F2F4',
                    'inactive-bg': '#B9C2CC',
                    'success': '#7CC24F',
                    'danger': '#EC2A2A',
                    'additional-danger-bg': '#F44C4C',
                    'additional-success-bg': '#75B8A0',
                    'additional-bg': '#B0BFC2'
                },
                layoutConfig: {
                    type: 'rounded',
                    mode: 'floating'
                }
            }
        }

        widgetAPI.value = new OpenSIPSWidget(config)

        emit('widget-api-init', widgetAPI.value)
    })

    widgetEl.style.zIndex = '99999'

    wrapperRef.value.appendChild(widgetEl)
}

onMounted(init)
</script>

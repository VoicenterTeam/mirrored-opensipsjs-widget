<template>
    <div
        ref="wrapperRef"
    />
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { OpenSIPSWidget } from '@/widget/OpenSIPSWidget'

const wrapperRef = ref(null)


onMounted(async () => {
    if (!wrapperRef.value) {
        return
    }

    if (!customElements.get('opensips-widget')) {
        customElements.define('opensips-widget', OpenSIPSWidget)
    }

    const widgetEl = document.createElement('opensips-widget')

    async function onWidgetInitialized ({ detail: initFunction }) {
        const credentials = {
            username: 'fV8Dt1RR',
            password: 'F3sHiwfV8fQ8npVA',
            domain: 'sip07.voicenter.co'
        }

        const themeSettings = {
            colors: {
                primary: '#1a202c',
                secondary: '#1a202c',
                accent: '#1a202c',
            },
            layoutConfig: {
                mode: 'floating',
                type: 'rounded'
            }
        }

        const callSettings = {
            allowTransfer: true,
            autoAnswer: {
                allowChange: false,
                defaultBehavior: true
            },
            outgoingCalls: false,
            callerInfo: {
                displayName: true,
                callerId: {
                    display: true,
                    mask: true
                }
            }
        }

        const widgetAPI = await initFunction({
            credentials,
            config: {
                themeSettings,
                callSettings
            }
        })

        console.log('widgetAPI', widgetAPI)
    }

    widgetEl.addEventListener('widget:ready', onWidgetInitialized)

    wrapperRef.value.appendChild(widgetEl)
})
</script>

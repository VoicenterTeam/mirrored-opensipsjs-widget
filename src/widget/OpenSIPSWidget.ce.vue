<template>
    <div ref="widgetWrapper">
        <!-- Tab Management Debug Panel -->
        <DebugPanel />

        <component
            :is="componentView"
            v-if="widgetType"
            :key="layoutType"
            @ready="onReady"
        >
            <template #top>
                <slot name="top" />
            </template>
            <template #pv-bottom-left>
                <slot name="pv-bottom-left" />
            </template>
            <template #pv-bottom-right>
                <slot name="pv-bottom-right" />
            </template>
        </component>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useOpenSIPSJS } from '@/composables/opensipsjs'
import RoundedCallView from '@/views/RoundedCallView.vue'
import { applySettingsToWidgetRootEl, layoutType, widgetType, widgetThemeSettings } from '@/composables/useWidgetConfig'
import { setWidgetElement } from '@/composables/useWidgetState'
import OpenSIPSExternalWidgetAPI from '@/widget/OpenSIPSExternalWidgetAPI'
import QuickCallView from '@/views/QuickCallView.vue'
import VideoCallView from '@/views/video/VideoCallView.vue'
import PhoneView from '@/views/PhoneView.vue'
import DebugPanel from '@/components/DebugPanel.vue'

const { getAudioState } = useOpenSIPSJS()
const { activeCalls } = getAudioState()

import {
    usedWidgetShadowRootEl
} from '@/composables/opensipsjs'
import type { IWidgetExternalAPIConstructor, CallUpdatedPayload } from '@/types/public-api'

const layoutTypeComponent = {
    rounded: RoundedCallView,
    quickCall: QuickCallView,
    video: VideoCallView,
    phoneView: PhoneView
}

defineOptions({
    inheritAttrs: false
})

const emit = defineEmits<{
    (e: 'widget:ready', payload: { detail: IWidgetExternalAPIConstructor }): void
    (e: 'calls:updated', payload: { detail: CallUpdatedPayload }): void
}>()

const widgetWrapper = ref()

/* Computed */
const componentView = computed(() => {
    if (!widgetType.value) {
        return null
    }

    if (widgetType.value === 'video') {
        return layoutTypeComponent['video']
    } else {
        return layoutTypeComponent[layoutType.value]
    }
})

/* Methods */
function onReady (draggableRoot: HTMLElement | undefined) {
    if (!(widgetWrapper.value instanceof HTMLElement)) {
        throw new Error('Widget Wrapper Element not found')
    }

    const rootNode = widgetWrapper.value.getRootNode()

    if (!(rootNode instanceof ShadowRoot)) {
        throw new Error('Root node not found')
    }

    const host = rootNode.host

    if (!(host instanceof HTMLElement)) {
        throw new Error('Host element not found in root node')
    }

    usedWidgetShadowRootEl.value = widgetWrapper.value

    // Store for later reapplication
    hostElement = host
    draggableElement = draggableRoot

    setWidgetElement(
        host,
        draggableRoot
    )

    applySettingsToWidgetRootEl(
        host,
        draggableRoot
    )
}

watch(
    activeCalls,
    (value, oldCalls) => {
        const newCallIds = new Set(Object.keys(value))
        const oldCallIds = new Set(Object.keys(oldCalls || {}))

        const currentCalls = Object.values(value)
        const previousCalls = Object.values(oldCalls || {})
        const removedCalls = previousCalls.filter(call => !newCallIds.has(call._id))
        const newCalls = currentCalls.filter(call => !oldCallIds.has(call._id))

        emit(
            'calls:updated',
            {
                detail: {
                    currentCalls,
                    newCalls,
                    removedCalls
                }
            }
        )
    },
    {
        deep: true,
    }
)

let hostElement: HTMLElement | null = null
let draggableElement: HTMLElement | undefined = undefined

watch(
    widgetThemeSettings,
    () => {
        if (hostElement) {
            console.log('🔧 widgetThemeSettings changed, reapplying settings...')
            applySettingsToWidgetRootEl(hostElement, draggableElement)
        }
    },
    { deep: true }
)

onMounted(
    () => {
        emit('widget:ready', { detail: OpenSIPSExternalWidgetAPI })
    }
)
</script>

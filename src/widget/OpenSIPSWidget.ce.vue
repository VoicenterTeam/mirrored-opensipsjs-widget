<template>
    <div ref="widgetWrapper">
        <component
            :is="componentView"
            v-if="widgetType"
            :key="layoutType"
            @ready="onReady"
        />
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted } from 'vue'
import { allActiveCalls } from '@/composables/opensipsjs'
import RoundedCallView from '@/views/RoundedCallView.vue'
import { applySettingsToWidgetRootEl, layoutType, widgetType } from '@/composables/useWidgetConfig'
import { useActiveTab } from '@/plugins/activeTabPlugin'
import { setWidgetElement } from '@/composables/useWidgetState'
import OpenSIPSExternalWidgetAPI from '@/widget/OpenSIPSExternalWidgetAPI'
import QuickCallView from '@/views/QuickCallView.vue'
import VideoCallView from '@/views/VideoCallView.vue'
import PhoneView from '@/views/PhoneView.vue'

import {
    usedWidgetShadowRootEl
} from '@/composables/opensipsjs'

const layoutTypeComponent = {
    rounded: RoundedCallView,
    quickCall: QuickCallView,
    video: VideoCallView,
    phoneView: PhoneView
}

const { setTabIDWithActiveCall } = useActiveTab()

defineOptions({
    inheritAttrs: false
})

const emit = defineEmits([ 'widget:ready' ])

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

    usedWidgetShadowRootEl.value = widgetWrapper.value

    setWidgetElement(rootNode.host, draggableRoot)

    applySettingsToWidgetRootEl(
        rootNode.host,
        draggableRoot
    )
}

watch(allActiveCalls, (calls) => {
    setTabIDWithActiveCall(!!(calls && calls.length))
})

onMounted(
    () => {
        emit('widget:ready', { detail: OpenSIPSExternalWidgetAPI })
    }
)
</script>

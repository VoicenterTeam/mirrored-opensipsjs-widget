<template>
    <component :is="componentView" v-if="true" :widget-element="widgetElement" @ready="onReady"/>
</template>

<script lang="ts" setup>
import { computed, watch } from 'vue'
import { allActiveCalls } from '@/composables/opensipsjs'
import RoundedCallView from '@/views/RoundedCallView.vue'
import { layoutType } from '@/composables/useWidgetConfig'
import { useActiveTab } from '@/plugins/activeTabPlugin'
import { setWidgetElement } from '@/composables/useWidgetState'
import OpenSIPSExternalWidgetAPI from '@/widget/OpenSIPSExternalWidgetAPI'
import QuickCallView from '@/views/QuickCallView.vue'
import type { IWidgetAppProps } from '@/types/internal'
import { getDefaultWidgetConfig } from '@/enum/defaultWidgetConfig.enum'

const layoutTypeComponent = {
    'rounded': RoundedCallView,
    'quickCall': QuickCallView
}

const { setTabIDWithActiveCall } = useActiveTab()

// Props
const props = defineProps<IWidgetAppProps>()

/* Computed */
const componentView = computed(() => layoutTypeComponent[layoutType.value])

let widgetReadyEmitted = false

/* Methods */
function onReady (draggableRoot: HTMLElement | undefined) {
    setWidgetElement(props.widgetElement, draggableRoot)

    if (!widgetReadyEmitted) {
      widgetReadyEmitted = true
      props.widgetElement.dispatchEvent('widget:ready', OpenSIPSExternalWidgetAPI)
    }

}

watch(allActiveCalls, (calls) => {
    if (calls && calls.length) {
        setTabIDWithActiveCall(true)
    } else {
        setTabIDWithActiveCall(false)
    }
})
</script>

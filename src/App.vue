<template>
    <component :is="componentView" :widget-element="widgetElement"/>
</template>

<script lang="ts" setup>
import { computed, watch } from 'vue'
import { allActiveCalls } from '@/composables/opensipsjs'
import RoundedCallView from '@/views/RoundedCallView.vue'
import { layoutType } from '@/composables/useWidgetConfig'
import { useActiveTab } from '@/plugins/activeTabPlugin'
import QuickCallView from '@/views/QuickCallView.vue'
import type { IWidgetAppProps } from '@/types/internal'

const layoutTypeComponent = {
    'rounded': RoundedCallView,
    'quickCall': QuickCallView
}

const { setTabIDWithActiveCall } = useActiveTab()

// Props
defineProps<IWidgetAppProps>()

/* Computed */
const componentView = computed(() =>  layoutTypeComponent[layoutType.value])

watch(allActiveCalls, (calls) => {
    if (calls && calls.length) {
        setTabIDWithActiveCall(true)
    } else {
        setTabIDWithActiveCall(false)
    }
})
</script>

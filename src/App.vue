<template>
    <div className="shadow-xl rounded-md min-h-[60px] flex flex-row border overflow-hidden">
        <Draggable
            v-show="showDraggableHandle"
            ref="draggableHandle"
        />
        <WidgetContent />
    </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { allActiveCalls } from '@/composables/opensipsjs'
import WidgetContent from '@/views/WidgetContent.vue'
import Draggable from '@/components/Draggable.vue'
import type { IWidgetAppProps } from '@/types/internal'
import { setWidgetElement } from '@/composables/useWidgetState'
import { layoutMode } from '@/composables/useWidgetConfig'
import OpenSIPSExternalWidgetAPI from '@/widget/OpenSIPSExternalWidgetAPI'
import { useActiveTab } from '@/plugins/activeTabPlugin'

const { setTabIDWithActiveCall } = useActiveTab()

// Props
const props = defineProps<IWidgetAppProps>()

/* Data */
const draggableHandle = ref<typeof Draggable>()

/* Computed */
const showDraggableHandle = computed(() => layoutMode.value === 'floating')

watch(allActiveCalls, (calls) => {
    if (calls && calls.length) {
        setTabIDWithActiveCall(true)
    } else {
        setTabIDWithActiveCall(false)
    }
})

// Methods
onMounted(() => {
    const draggableRoot = draggableHandle.value?.root as HTMLElement | undefined

    setWidgetElement(props.widgetElement, draggableRoot)

    props.widgetElement.dispatchEvent('widget:ready', OpenSIPSExternalWidgetAPI)
})

onBeforeUnmount(() => {
    props.widgetElement.dispatchEvent('widget:destroy', undefined)
})
</script>

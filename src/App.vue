<template>
    <div>
        <div v-if="isQuickCall">
            <QuickCallView
                :widget-element="widgetElement"
                @call="onCall"
            />
        </div>
        <div v-else className="shadow-xl rounded-md min-h-[60px] flex flex-row border overflow-hidden">
            <Draggable
                v-show="showDraggableHandle"
                ref="draggableHandle"
            />
            <WidgetContent />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref, UnwrapRef, watch } from 'vue'
import { allActiveCalls } from '@/composables/opensipsjs'
import WidgetContent from '@/views/WidgetContent.vue'
import Draggable from '@/components/Draggable.vue'
import { setWidgetElement } from '@/composables/useWidgetState'
import { layoutMode, isQuickCall } from '@/composables/useWidgetConfig'
import OpenSIPSExternalWidgetAPI from '@/widget/OpenSIPSExternalWidgetAPI'
import { useActiveTab } from '@/plugins/activeTabPlugin'
import QuickCallView from '@/views/QuickCallView.vue'

const { setTabIDWithActiveCall } = useActiveTab()

// Props
const props = withDefaults(
    defineProps<{
        widgetElement: HTMLElement
    }>(),
    {}
)

/* Data */
const draggableHandle = ref<typeof Draggable>()

/* Computed */
const showDraggableHandle = computed(() => layoutMode.value === 'floating')

const onCall = () => {
    props.widgetElement.dispatchEvent('widget:login', {})

    //props.widgetElement.dispatchEvent('widget:ready', OpenSIPSExternalWidgetAPI)
}

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

    if (!isQuickCall.value) {
        props.widgetElement.dispatchEvent('widget:login', {})
    }
})

onBeforeUnmount(() => {
    props.widgetElement.dispatchEvent('widget:destroy', {})
})
</script>

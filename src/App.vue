<template>
    <div ref="widgetRoot" className="shadow-xl rounded-md min-h-[60px] flex flex-row border overflow-hidden">
        <Draggable
            v-show="showDraggableHandle"
            ref="draggableHandle"
        />
        <WidgetContent />
    </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { registerOpenSIPS, useExternalOpenSIPSJS, isOpenSIPSReady } from '@/composables/opensipsjs'
import WidgetContent from '@/views/WidgetContent.vue'
import Draggable from '@/components/Draggable.vue'
import type { IWidgetAppProps } from '@/types/internal'
import type { IWidgetInitOptions } from '@/types/public-api'
import { setWidgetElement } from '@/composables/useWidgetState'
import { layoutMode } from '@/composables/useWidgetConfig'

// Props
const props = defineProps<IWidgetAppProps>()

/* Data */
const draggableHandle = ref<typeof Draggable>()

/* Computed */
const showDraggableHandle = computed(() => layoutMode.value === 'floating')

// Methods
async function makeWidgetAPI ({ credentials, config }: IWidgetInitOptions) {
    if (!isOpenSIPSReady.value) {
        await registerOpenSIPS(credentials)
    }

    return useExternalOpenSIPSJS(config)
}

onMounted(() => {
    const draggableRoot = draggableHandle.value?.root as HTMLElement | undefined

    setWidgetElement(props.widgetElement, draggableRoot)

    props.widgetElement.dispatchEvent('widget:ready', makeWidgetAPI)
})

onBeforeUnmount(() => {
    props.widgetElement.dispatchEvent('widget:destroy', undefined)
})
</script>

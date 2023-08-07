<template>
    <div ref="widgetRoot" className="shadow-xl rounded-md min-h-[60px] flex flex-row border overflow-hidden">
        <Draggable @mousedown.prevent="dragStart" />
        <WidgetContent />
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { registerOpenSIPS, useExternalOpenSIPSJS, isOpenSIPSReady } from '@/composables/opensipsjs'
import WidgetContent from '@/views/WidgetContent.vue'
import Draggable from '@/components/Draggable.vue'
import type { IWidgetAppProps } from '@/types/internal'
import type { IWidgetInitOptions } from '@/types/public-api'

// Props
const props = defineProps<IWidgetAppProps>()

// Data
const widgetRoot = ref<HTMLElement>()

// Methods
async function widgetReady ({ credentials, config }: IWidgetInitOptions) {
    if (!widgetRoot.value) {
        throw new Error('Widget root element is not defined')
    }

    if (!isOpenSIPSReady.value) {
        await registerOpenSIPS(credentials)
    }

    return useExternalOpenSIPSJS(config, widgetRoot.value)
}

onMounted(() => {
    props.dispatchActionEvent(
        'widget:ready',
        widgetReady
    )
})
</script>

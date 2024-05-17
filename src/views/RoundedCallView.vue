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
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import WidgetContent from '@/views/WidgetContent.vue'
import Draggable from '@/components/Draggable.vue'
import { layoutMode } from '@/composables/useWidgetConfig'
import { setWidgetElement } from '@/composables/useWidgetState'
import OpenSIPSExternalWidgetAPI from '@/widget/OpenSIPSExternalWidgetAPI'
import type { IWidgetAppProps } from '@/types/internal'

/* Emits */
const emit = defineEmits<{
  (event: 'ready', value: HTMLElement | undefined): void
}>()

/* Props */
const props = defineProps<IWidgetAppProps>()

/* Data */
const draggableHandle = ref<typeof Draggable>()

/* Computed */
const showDraggableHandle = computed(() => layoutMode.value === 'floating')

onMounted(() => {
    const draggableRoot = draggableHandle.value?.root as HTMLElement | undefined

    emit('ready', draggableRoot)

    /*setWidgetElement(props.widgetElement, draggableRoot)

    console.log('rounded dispatch')
    props.widgetElement.dispatchEvent('widget:ready', OpenSIPSExternalWidgetAPI)*/
})

/*onBeforeUnmount(() => {
    props.widgetElement.dispatchEvent('widget:destroy', undefined)
})*/
</script>

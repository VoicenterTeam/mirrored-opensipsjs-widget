<template>
    <div
        ref="videoCallViewWrapper"
        class="shadow-xl rounded-md min-h-[600px] h-[600px] min-w-[900px] w-[900px] flex flex-row border border-border-lines overflow-hidden"
    >
        <Draggable
            v-show="showDraggableHandle"
            ref="draggableHandle"
        />
        <VideoWidgetContent :element-width="videoWidgetContentWidth" />
    </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, useTemplateRef  } from 'vue'
import VideoWidgetContent from '@/views/VideoWidgetContent.vue'
import Draggable from '@/components/Draggable.vue'
import { layoutMode } from '@/composables/useWidgetConfig'
import { useElementSize } from '@vueuse/core'

/* Emits */
const emit = defineEmits<{
    (event: 'ready', value: HTMLElement | undefined): void
}>()

/* Data */
const draggableHandle = ref<typeof Draggable>()
const videoCallViewEl = useTemplateRef('videoCallViewWrapper')
const { width } = useElementSize(videoCallViewEl)

/* Computed */
const showDraggableHandle = computed(() => {
    return layoutMode.value === 'floating'
})

const videoWidgetContentWidth = computed(() => {
    return width.value - 24
})

onMounted(() => {
    const draggableRoot = draggableHandle.value?.root as HTMLElement | undefined

    emit('ready', draggableRoot)
})
</script>

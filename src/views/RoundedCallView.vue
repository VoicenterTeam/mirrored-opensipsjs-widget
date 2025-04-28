<template>
    <div class="shadow-xl rounded-md min-h-[60px] flex flex-row border border-border-lines overflow-hidden">
        <Draggable
            v-show="showDraggableHandle"
            ref="draggableHandle"
        />
        <WidgetContent />
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import WidgetContent from '@/views/WidgetContent.vue'
import Draggable from '@/components/Draggable.vue'
import { showDraggableHandle } from '@/composables/useWidgetConfig'

/* Emits */
const emit = defineEmits<{
    (event: 'ready', value: HTMLElement | undefined): void
}>()

/* Data */
const draggableHandle = ref<typeof Draggable>()

onMounted(() => {
    const draggableRoot = draggableHandle.value?.root as HTMLElement | undefined

    emit('ready', draggableRoot)
})
</script>

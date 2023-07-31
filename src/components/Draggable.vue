<template>
    <div className="flex rounded-l-md w-6 cursor-grab draggable-area" @mousedown="onMouseDown">
        <DragDrop color="var(--border-lines)" />
    </div>
</template>

<script lang="ts" setup>
import type { IWidgetAppProps } from '@/types/internal'
import DragDrop from '@/assets/icons/dragdrop.svg'

const props = defineProps<IWidgetAppProps>()

function onMouseDown (e: MouseEvent) {
    props.dragStart(e)
}
</script>

<style scoped>

</style>

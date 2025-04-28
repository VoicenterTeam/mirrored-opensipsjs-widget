<template>
    <div
        ref="root"
        class="flex w-6 z-50 cursor-grab draggable-area"
    >
        <DragDrop color="var(--border-lines)" />
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import DragDrop from '@/assets/icons/dragdrop.svg?component'

/* Data */
const root = ref<HTMLElement>()

defineExpose({ root })
</script>


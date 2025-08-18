<template>
    <div
        ref="root"
        class="flex w-8 z-50 cursor-grab draggable-area"
    >
        <i
            class="vc-lc-grip-vertical text-2xl"
            style="color: #8292A5"
        />
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

/* Data */
const root = ref<HTMLElement>()

defineExpose({ root })
</script>


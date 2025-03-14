<template>
    <div class="popup-header-container flex justify-between items-center gap-x-1 py-2 px-4 h-12">
        <template v-if="$slots.default">
            <slot />
        </template>
        <template v-else>
            <div class="header font-bold text-base truncate">
                {{ header }}
            </div>
        </template>
        <button
            class="close-button p-2"
            @click="action"
        >
            <i
                class="text-base vc-lc-x flex"
                :style="{ color: 'var(--default-text)' }"
            />
        </button>
    </div>
</template>
<script setup lang="ts">

/* Props */

interface Props {
    header?: string,
    action: () => void,
}
defineProps<Props>()
</script>
<style scoped lang="scss">
.popup-header-container {
  border-bottom: 0.5px solid var(--ui-lines);
  .header {
    color: var(--default-text)
  }
  .close-button {
    border-radius: 6px;
    border:  0.5px solid var(--ui-lines);
  }
}
</style>

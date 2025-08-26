<template>
    <button
        class="options-action-button cursor-pointer"
        @click="onClick"
    >
        <i
            class="text-primary-actions"
            :class="`${icon} text-${size}`"
        />
    </button>
</template>

<script lang="ts" setup>
withDefaults(
    defineProps<{
        icon: string
        size?: string
    }>(),
    {
        size: 'lg'
    }
)

const emit = defineEmits<{
    (e: 'click', payload: Event): void
}>()

function onClick (event: Event) {
    emit('click', event)
}
</script>

<style scoped>
.options-action-button {
  @apply flex items-center;
  font-size: 11px;
  height: 24px;
  border-radius: 11px;
  padding: 2px;
}
</style>


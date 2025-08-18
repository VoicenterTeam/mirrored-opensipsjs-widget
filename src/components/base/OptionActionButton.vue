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
<!--  <div class="add-caller-button">

  </div>-->
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { Credentials } from '~/docs/composable/useAuthorisation.ts'

const props = withDefaults(
    defineProps<{
        icon: string
        size: string
    }>(),
    {
        size: 'lg'
    }
)

const emit = defineEmits<{
    (e: 'click', payload: Event): void
}>()

function onClick (event) {
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


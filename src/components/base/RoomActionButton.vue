<template>
    <button
        class="room-action-button"
        :disabled="disabled"
        @click="onClick"
    >
        <i
            class="text-lg"
            :class="icon"
        />
        <span v-if="label">
            {{ label }}
        </span>
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
        label?: string
        disabled?: boolean
    }>(),
    {
        disabled: false
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
.room-action-button {
  @apply flex items-center bg-primary-actions-bg--focus;
  font-size: 11px;
  height: 24px;
  border-radius: 11px;
  padding: 2px 10px 2px 2px;
  font-weight: 500;
  color: #354260;
}

.room-action-button i {
  margin-right: 4px;
  color: #354260;
}

.room-action-button:disabled,
.room-action-button[disabled]{
  @apply cursor-text bg-primary-actions-bg--pressed;
}
</style>


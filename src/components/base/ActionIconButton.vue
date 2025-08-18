<template>
    <button
        style="height: 30px; width: 30px; padding: 6px 5px 5px 5px; margin: 1px;"
        class="action-button"
        :class="`bg-${bgColor} ${rounded ? 'rounded-button': ''}`"
        :disabled="props.disabled"
        @click="onClick"
    >
        <i
            class="icon-base-size"
            :class="`${icon} text-${color}`"
        />
    </button>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { Credentials } from '~/docs/composable/useAuthorisation.ts'

const props = withDefaults(
    defineProps<{
        color: string
        bgColor: string
        icon: string
        rounded?: boolean
        disabled?: boolean
    }>(),
    {
        bgColor: 'primary-actions-bg--focus',
        disabled: false,
        rounded: false
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
.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
}

.rounded-button {
  border-radius: 50%;
}

.action-button:hover {
  filter: brightness(110%);
}

.icon-base-size {
  font-size: 20px;
}
</style>


<template>
    <button
        style="padding: 6px 5px 5px 5px; margin: 1px;"
        :style="{height: buttonSize, width: buttonSize }"
        class="action-button"
        :class="`bg-${bgColor} ${rounded ? 'rounded-button': ''}`"
        :disabled="props.disabled"
        @click="onClick"
    >
        <i :class="`${icon} text-${color} icon-${size}-size`" />
    </button>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = withDefaults(
    defineProps<{
        color: string
        icon: string
        bgColor?: string
        size?: 'base' | 'sm'
        rounded?: boolean
        disabled?: boolean
    }>(),
    {
        bgColor: 'primary-actions-bg--focus',
        disabled: false,
        rounded: false,
        size: 'base'
    }
)

const emit = defineEmits<{
    (e: 'click', payload: Event): void
}>()

const buttonSize = computed(() => {
    if (props.size === 'base') {
        return '30px'
    }
    else if (props.size === 'sm') {
        return '26px'
    }

    return '30px'
})

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

.icon-sm-size {
  font-size: 16px;
}
</style>


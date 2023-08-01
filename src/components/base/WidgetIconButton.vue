<template>
    <button :className="buttonClasses">
        <div :className="iconSize">
            <component :is="icon"/>
        </div>
    </button>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { ColorsType } from '@/types/public-api'
import type { Component } from 'vue'

const props = withDefaults(
    defineProps<{
        color: ColorsType,
        icon: Component,
        // The icon which will be displayed on focus/active state
        pressedIcon?: Component
        pressed?: boolean
        size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl'
    }>(),
    {
        pressed: false,
        size: 'base'
    }
)

// Computed
const icon = computed(() => {
    if (props.pressed && props.pressedIcon) {
        return props.pressedIcon
    } else {
        return props.icon
    }
})
const iconSize = computed(() => {
    switch (props.size) {
        case 'xs':
            return 'w-2 h-2'
        case 'sm':
            return 'w-3 h-3'
        case 'base':
            return 'w-4 h-4'
        case 'lg':
            return 'w-5 h-5'
        case 'xl':
            return 'w-6 h-6'
        default:
            return 'w-4 h-4'
    }
})
const buttonClasses = computed(() => {
    const base = `
        p-1.5
        pointer
    `

    if (props.pressed) {
        return `
            ${base}
            bg-${props.color}
            text-button-pressed-text
        `
    } else {
        return `
            ${base}
            bg-secondary-bg
            text-${props.color}
            focus:bg-${props.color}
            focus:text-button-pressed-text
            hover:bg-${props.color}
            hover:text-button-pressed-text
        `
    }
})
</script>

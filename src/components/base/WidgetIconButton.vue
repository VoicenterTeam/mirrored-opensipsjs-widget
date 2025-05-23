<template>
    <button :className="buttonClasses" :disabled="props.disabled">
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
        color: ColorsType
        pressedColor: ColorsType
        manual?: boolean | undefined
        icon: Component
        disabled?: boolean
        // The icon which will be displayed on focus/active state
        pressedIcon?: Component
        pressed?: boolean
        size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | 'xxl' | 'xxxl'
        additionalClasses?: string
        useFocusEffect?: boolean
        usePadding?: boolean
    }>(),
    {
        pressed: undefined,
        pressedColor: 'secondary-bg',
        size: 'base',
        disabled: false,
        additionalClasses: '',
        useFocusEffect: true,
        usePadding: true
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
        case 'xxl':
            return 'w-7 h-7'
        case 'xxxl':
            return 'w-8 h-8'
        default:
            return 'w-4 h-4'
    }
})
const buttonClasses = computed(() => {
    let base = `
        ${props.usePadding ? 'p-1.5' : ''}
        ${props.additionalClasses}
    `

    if (props.pressed !== undefined) {
        if (props.pressed) {
            return `
                ${base}
                cursor-pointer
                bg-${props.color}
                text-button-pressed-text
            `
        } else {
            return `
                ${base}
                cursor-pointer
                bg-${props.pressedColor}
                text-${props.color}
            `
        }
    } else if (props.disabled) {
        return `
            ${base}
            cursor-not-allowed
            bg-inactive-bg
            text-button-pressed-text
        `
    } else {
        const primaryClasses = `
            ${base}
            cursor-pointer
            bg-${props.pressedColor}
            text-${props.color}
            hover:bg-${props.color}
            hover:text-button-pressed-text
        `

        if (props.useFocusEffect) {
            return `
              ${primaryClasses}
              focus:bg-${props.color}
              focus:text-button-pressed-text
            `
        } else {
            return primaryClasses
        }
    }
})
</script>

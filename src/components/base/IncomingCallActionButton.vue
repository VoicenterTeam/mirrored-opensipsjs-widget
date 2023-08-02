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
        hoverColor?: ColorsType,
        size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | 'xxl' | 'xxxl'
        additionalClasses?: string
    }>(),
    {
        size: 'base',
        additionalClasses: ''
    }
)

// Computed
const icon = computed(() => {
    return props.icon
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
        p-1
        pointer
        ${props.additionalClasses}
    `

    return `
        ${base}
        text-${props.color}
        focus:text-${props.hoverColor || props.color}
        hover:text-${props.hoverColor || props.color}
    `
})
</script>

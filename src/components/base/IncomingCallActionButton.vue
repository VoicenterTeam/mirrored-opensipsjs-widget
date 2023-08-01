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
        hoverColor: ColorsType,
        icon: Component,
        size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | 'xxl'
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
            return 'w-8 h-8'
        default:
            return 'w-4 h-4'
    }
})
const buttonClasses = computed(() => {
    let base = `
        p-1.5
        pointer
        ${props.additionalClasses}
    `

    return `
        ${base}
        text-${props.color}
        focus:text-${props.hoverColor}
        hover:text-${props.hoverColor}
    `
})
</script>

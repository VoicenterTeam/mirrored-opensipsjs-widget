<template>
    <div/>
</template>

<script lang="ts" setup>
export type ColorType = 'primary' | 'success' | 'danger'

const props = withDefaults(
    defineProps<{
        color: ColorType,
        icon: string,
        // The icon which will be displayed on focus/active state
        pressedIcon?: string
        pressed: boolean
    }>(),
    {
        pressed: false
    }
)
</script>

<style scoped>
// The icon should be the provided color if not active/focused, if active/focused the icon color should be white, the
</style>

<template>
    <input v-model="model" type="text" className="border">
</template>

<script lang="ts" setup>
import { useVModel } from '@vueuse/core'

const props = defineProps<{
    modelValue: string
}>()
const emit = defineEmits([ 'update:modelValue' ])

const model = useVModel(props, 'modelValue', emit)
</script>

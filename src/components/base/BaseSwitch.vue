<template>
    <label class="toggle_el__switch">
        <input v-model="toggleValue" :disabled="props.disabled" type="checkbox" class="toggle_el__input">
        <div class="toggle_el__slider round"/>
    </label>
</template>
<script setup lang="ts">
import type { WritableComputedRef } from 'vue'
import { useVModel } from '@vueuse/core'

const props = defineProps<{
    modelValue: boolean
    disabled: boolean
}>()
const emit = defineEmits([ 'update:modelValue' ])

const toggleValue = useVModel(props, 'modelValue', emit) as WritableComputedRef<boolean>
</script>

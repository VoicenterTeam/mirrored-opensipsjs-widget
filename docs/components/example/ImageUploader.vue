<template>
    <div>
        <FileUploader v-model="soundData" accept="image/*" v-bind="$attrs" :max-size="maxSize" />

        <img v-if="soundData" :src="soundData">
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import FileUploader from './FileUploader.vue'

const props = defineProps<{
        modelValue: string,
        maxSize?: number
    }>()

const emit = defineEmits<{
    'update:modelValue': (value: string) => void
}>()

const soundData = computed({
    get () {
        return props.modelValue
    },
    set (value) {
        emit('update:modelValue', value)
    }
})
</script>

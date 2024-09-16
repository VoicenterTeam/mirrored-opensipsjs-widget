<template>
    <div>
        <VcFileUploader
            v-model="soundData"
            accept="audio/*"
            v-bind="$attrs"
            :max-size="maxSize"
        />

        <audio
            v-if="soundData"
            controls
            :src="soundData"
            loop
        />
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import VcFileUploader from '@voicenter-team/voicenter-ui-plus'

const props = defineProps<{
    modelValue: string,
    maxSize?: number
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', payload: string): void
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

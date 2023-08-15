<template>
    <div className="flex h-full justify-center p-0.5">
        <div className="flex bg-primary-bg border rounded p-0.5">
            <input v-model="inputValue" type="text" className="outline-transparent text-xxs pl-2">
            <div className="w-4 h-4 text-secondary-text">
                <button className="p-1 pointer bg-primary-bg" @click="onClose">
                    <div className="w-2 h-2">
                        <CloseIcon />
                    </div>
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { WritableComputedRef } from 'vue'
import CloseIcon from '@/assets/icons/close.svg?component'
import { useVModel } from '@vueuse/core'

const props = withDefaults(
    defineProps<{
        modelValue: string
    }>(),
    {}
)

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
    (e: 'close'): void
}>()

const inputValue = useVModel(props, 'modelValue', emit) as WritableComputedRef<string>

const onClose = () => {
    emit('close')
}

</script>

<style scoped>

</style>

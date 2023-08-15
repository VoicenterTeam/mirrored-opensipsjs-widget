<template>
    <div className="flex h-full justify-center p-0.5">
        <div :className="wrapperClasses">
            <input
                v-model="inputValue"
                placeholder="+972 ___-___-__-__"
                type="text"
                :className="inputClasses"
            >
            <div className="w-4 h-4 text-secondary-text">
                <button :className="buttonClasses" @click="onClose">
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
import { computed } from 'vue'

const props = withDefaults(
    defineProps<{
        modelValue: string
        bgColor: string
    }>(),
    {
        bgColor: 'primary-bg'
    }
)

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
    (e: 'close'): void
}>()

const inputValue = useVModel(props, 'modelValue', emit) as WritableComputedRef<string>

const wrapperClasses = computed(() => {
    return `flex bg-${props.bgColor} border rounded p-0.5`
})

const inputClasses = computed(() => {
    return `outline-0 bg-${props.bgColor} text-main-text text-xxs pl-2`
})

const buttonClasses = computed(() => {
    return `p-1 pointer bg-${props.bgColor}`
})
const onClose = () => {
    emit('close')
}

</script>

<style scoped>

</style>

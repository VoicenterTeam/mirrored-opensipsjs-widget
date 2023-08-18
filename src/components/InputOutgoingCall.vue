<template>
    <div className="flex h-full justify-center p-0.5">
        <div :className="wrapperClasses">
            <input
                v-model="inputValue"
                :className="inputClasses"
                :placeholder="inputPlaceholder"
                type="text"
                @keyup.enter.prevent="onKeyPressed"
            >
            <div v-if="inputValue" className="w-4 h-4 text-secondary-text">
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
import { computed } from 'vue'
import type { WritableComputedRef } from 'vue'
import { useVModel } from '@vueuse/core'
import CloseIcon from '@/assets/icons/close.svg?component'
import { outgoingCallPrefix } from '@/composables/useWidgetConfig'

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
    (e: 'call'): void
}>()

const inputValue = useVModel(props, 'modelValue', emit) as WritableComputedRef<string>

const wrapperClasses = computed(() => {
    return `flex w-[156px] bg-${props.bgColor} border rounded p-0.5`
})

const inputClasses = computed(() => {
    return `outline-0 bg-${props.bgColor} text-main-text text-xxs pl-2`
})

const buttonClasses = computed(() => {
    return `p-1 pointer bg-${props.bgColor}`
})

const inputPlaceholder = computed(() => {
    return `+${outgoingCallPrefix.value} ___-___-__-__`
})

const onKeyPressed = () => {
    emit('call')
}
const onClose = () => {
    emit('close')
}

</script>

<style scoped>

</style>

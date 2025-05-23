<template>
    <div className="flex h-full justify-center p-0.5">
        <div :className="wrapperClasses">
            <input
                v-model="inputValue"
                :className="inputClasses"
                :placeholder="outgoingCallInputPlaceholder"
                @input="applyPatterns"
                @keyup.enter.prevent="onKeyPressed"
            >
            <div v-if="inputValue" className="w-4 h-4 text-secondary-text">
                <div :className="buttonClasses" @click="onClose">
                    <div className="w-2 h-2">
                        <CloseIcon />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { WritableComputedRef } from 'vue'
import { useVModel } from '@vueuse/core'
import CloseIcon from '@/assets/icons/close.svg?component'
import { outgoingCallInputPlaceholder, outgoingInputRegexValidator } from '@/composables/useWidgetConfig'

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
    return `flex w-[156px] bg-${props.bgColor} border border-border-lines rounded p-0.5`
})

const inputClasses = computed(() => {
    return `outline-0 bg-${props.bgColor} text-main-text text-xxs pl-2 remove-arrow`
})

const buttonClasses = computed(() => {
    return `p-1 cursor-pointer bg-${props.bgColor}`
})

const onKeyPressed = () => {
    emit('call')
}
const onClose = () => {
    emit('close')
}
const applyPatterns = (event: Event) => {
    const evt = event.target as HTMLInputElement
    let newInputValue = evt.value

    const regexPatterns = [ ...outgoingInputRegexValidator.value ]

    regexPatterns.forEach((pattern) => {
        const regexFromStr = new RegExp(pattern)
        if (!regexFromStr.test(newInputValue)) {
            newInputValue = newInputValue.replace(new RegExp(`[^${regexFromStr.source}]`, 'g'), '')
        }
    })

    inputValue.value = newInputValue
}

</script>

<style scoped>

</style>

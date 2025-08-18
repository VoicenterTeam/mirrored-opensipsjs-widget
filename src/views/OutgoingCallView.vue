<template>
    <div className="flex w-full h-[32px] p-0.5 bg-primary-bg">
        <InputOutgoingCall
            v-model="inputValue"
            bg-color=""
            @call="startCall"
            @close="clearOutgoingInput"
        />
        <!--        <IncomingCallActionButton
            color="success"
            hover-color="additional-success-bg"
            :icon="CallIcon"
            size="lg"
            @click="startCall"
        />-->
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import CallIcon from '@/assets/icons/call.svg?component'
import InputOutgoingCall from '@/components/InputOutgoingCall.vue'
import IncomingCallActionButton from '@/components/base/IncomingCallActionButton.vue'

const emit = defineEmits<{
    (e: 'call', value: string): void
}>()

const inputValue = ref<string>('')

const clearOutgoingInput = () => {
    inputValue.value = ''
}

const startCall = () => {
    if (!inputValue.value) {
        return
    }
    emit('call', inputValue.value)
}

const typeDigit = (digit: string) => {
    inputValue.value = inputValue.value + digit.toString()
}

defineExpose({
    typeDigit,
    startCall
})
</script>

<style scoped>

</style>

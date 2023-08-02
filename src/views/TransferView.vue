<template>
    <div className="flex justify-around items-center">
        <div className="flex items-center justify-center uppercase px-2">
            Transfer
        </div>

        <div className="px-2">
            <BaseInput v-model="target" />
        </div>

        <div>
            <IncomingCallActionButton
                color="success"
                hover-color="additional-success-bg"
                :icon="CheckmarkIcon"
                size="xxl"
                @click="doTransfer" />
            <IncomingCallActionButton
                color="danger"
                hover-color="additional-danger-bg"
                :icon="CloseIcon"
                size="xxl"
                additional-classes=""
                @click="cancelTransferring" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import type { UnwrapRef } from 'vue'
import CheckmarkIcon from '@/assets/icons/checkmark.svg?component'
import CloseIcon from '@/assets/icons/close.svg?component'
import IncomingCallActionButton from '@/components/base/IncomingCallActionButton.vue'
import type { ICall } from '@voicenter-team/opensips-js/src/types/rtc'
import { useOpenSIPSJS } from '@/composables/opensipsjs'
import BaseInput from '@/components/base/BaseInput.vue'

const { answerCall, terminateCall } = useOpenSIPSJS()

const target = ref<string>('')

const props = withDefaults(
    defineProps<{
        callId: string
    }>(),
    {}
)

const emit = defineEmits<{
    (e: 'transfer', callId: string, target: string): void
    (e: 'cancel'): void
}>()

const doTransfer = () => {
    //console.log('doTransfer', props.call._id)
    if (!target.value) {
        return
    }
    emit('transfer', props.callId, target.value)
}

const cancelTransferring = () => {
    //console.log('cancelTransfering', props.call)
    emit('cancel')
}

const callerNumber = computed(() => {
    return props.call?._remote_identity._uri._user as string
})

</script>

<style scoped>

</style>

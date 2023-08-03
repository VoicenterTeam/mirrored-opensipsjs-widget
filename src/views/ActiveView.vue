<template>
    <div :className="wrapperClasses">
        <RingingView v-if="incomingUnansweredCall" :call="incomingUnansweredCall" />
        <ActiveCallView
            v-if="incomingAnsweredCall"
            v-show="!transferringCall"
            :call="incomingAnsweredCall"
            @transfer-click="onTransferClick"
        />
        <TransferView
            v-if="transferringCall"
            :call-id="transferringCall"
            @transfer="onCallTransfer"
            @cancel="cancelTransferring"
        />
        <div v-if="!isAnyActiveCall">
            <div className="flex min-h-[32px] justify-center items-center">
                <VoicenterIcon />
            </div>
        </div>
        <ActionButtons v-if="!incomingUnansweredCall"  />
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import type { ICall } from '@voicenter-team/opensips-js/src/types/rtc'
import ActionButtons from '@/components/ActionButtons.vue'
import VoicenterIcon from '@/assets/icons/voicenter.svg?component'
import TransferView from '@/views/TransferView.vue'
import RingingView from '@/views/RingingView.vue'
import ActiveCallView from '@/components/views/active/ActiveCallView.vue'
import { allowShrinkOnIdle } from '@/composables/useCallSettingsPermissions'
import { allActiveCalls, useOpenSIPSJS } from '@/composables/opensipsjs'

const { transferCall, answerCall, opensipsjs } = useOpenSIPSJS()

const transferringCall = ref<string>('')

const isAnyActiveCall = computed(() => {
    return Object.values(allActiveCalls.value).length > 0
})

const incomingUnansweredCall = computed(() => {
    const incomingCallObject = Object.values(allActiveCalls.value).find((call: ICall) => {
        return call.direction === 'incoming' && !call._is_confirmed && !call._is_canceled
    })

    if (opensipsjs.autoAnswer && incomingCallObject) {
        answerCall(incomingCallObject._id)
        return undefined
    }

    return incomingCallObject
})

const incomingAnsweredCall = computed(() => {
    const incomingCallObject = Object.values(allActiveCalls.value).find((call: ICall) => {
        return call.direction === 'incoming' && call._is_confirmed
    })

    return incomingCallObject
})

const wrapperClasses = computed(() => {
    const baseClasses = 'min-h-[60px]'
    if (allowShrinkOnIdle.value && !isAnyActiveCall.value) {
        return `${baseClasses} min-w-[116px]`
    } else {
        return `${baseClasses} min-w-[354px]`
    }
})

const onTransferClick = (callId: string) => {
    transferringCall.value = callId
}

const cancelTransferring = () => {
    transferringCall.value = ''
}

const onCallTransfer = (callId: string, target: string) => {
    transferCall(callId, target)
    transferringCall.value = ''
}

</script>

<style scoped>

</style>

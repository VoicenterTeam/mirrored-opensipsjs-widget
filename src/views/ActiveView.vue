<template>
    <div :className="wrapperClasses">
        <RingingView
            v-if="incomingUnansweredCall && !transferringCall"
            :call="incomingUnansweredCall"
            @transfer-click="onTransferClick"
        />
        <ActiveCallsView
            v-show="!transferringCall && !movingCall && !incomingUnansweredCall"
            :calls="activeCalls"
            @transfer-click="onTransferClick"
            @move-click="onMoveClick"
        />
        <TransferView
            v-if="transferringCall"
            :call-id="transferringCall"
            @transfer="onCallTransfer"
            @cancel="cancelTransferring"
        />
        <MoveView
            v-if="movingCall"
            :call-id="movingCall"
            @move="onCallMove"
            @cancel="cancelMoving"
        />
        <div v-if="!isAnyActiveCall">
            <div className="flex min-h-[32px] bg-primary-bg justify-center items-center">
                <VoicenterIcon />
            </div>
        </div>
        <ActionButtons v-if="!incomingUnansweredCall" @merge-click="onCallsMerge"/>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import type { ICall } from '@voicenter-team/opensips-js/src/types/rtc'
import ActionButtons from '@/components/ActionButtons.vue'
import VoicenterIcon from '@/assets/icons/voicenter.svg?component'
import TransferView from '@/views/TransferView.vue'
import RingingView from '@/views/RingingView.vue'
import { allowShrinkOnIdle } from '@/composables/useCallSettingsPermissions'
import { allActiveCalls, useOpenSIPSJS } from '@/composables/opensipsjs'
import ActiveCallsView from '@/views/ActiveCallsView.vue'
import MoveView from '@/views/MoveView.vue'

const { transferCall, answerCall, moveCall, mergeCallsInRoom, opensipsjs } = useOpenSIPSJS()

const transferringCall = ref<string>('')
const movingCall = ref<string>('')

const isAnyActiveCall = computed(() => {
    return allActiveCalls.value.length > 0
})

const incomingUnansweredCall = computed(() => {
    const incomingCallObject = allActiveCalls.value.find((call: ICall) => {
        return call.direction === 'incoming' && !call._is_confirmed && !call._is_canceled
    })

    if (opensipsjs.autoAnswer && incomingCallObject) {
        answerCall(incomingCallObject._id)
        return undefined
    }

    return incomingCallObject
})

const activeCalls = computed(() => {
    const activeCallObjects: Array<ICall> = allActiveCalls.value
        .filter((call: ICall) => {
            return call._is_confirmed
        })

    return activeCallObjects
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

const onMoveClick = (callId: string) => {
    movingCall.value = callId
}

const cancelMoving = () => {
    movingCall.value = ''
}

const onCallTransfer = (callId: string, target: string) => {
    transferCall(callId, target)
    transferringCall.value = ''
}

const onCallMove = (callId: string, targetRoom: number) => {
    moveCall(callId, targetRoom)
    movingCall.value = ''
}

const onCallsMerge = (roomId: number) => {
    mergeCallsInRoom(roomId)
}

</script>

<style scoped>

</style>

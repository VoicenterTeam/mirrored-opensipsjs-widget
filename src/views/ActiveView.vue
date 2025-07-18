<template>
    <div :className="wrapperClasses">
        <div
            v-if="showTopKeypad"
            class="flex items-center justify-center p-2 border-b-1 border-border-lines"
        >
            <Keypad @press="onKeypadKeyPress" />
        </div>
        <RingingView
            v-if="incomingUnansweredCall && !transferringCall"
            :call="incomingUnansweredCall"
            @transfer-click="onTransferClick"
        />
        <div v-if="outgoingUnansweredCall && !incomingUnansweredCall">
            <OutgoingCallInProgressView
                :number="outgoingUnansweredCall?._remote_identity?._uri?._user"
                @hangup="onOutgoingCallHangup"
            />
        </div>
        <ActiveCallsView
            v-show="!transferringCall && !movingCall && !incomingUnansweredCall && !outgoingUnansweredCall"
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
            <OutgoingCallView
                v-if="allowOutgoingCalls"
                ref="outgoingCallView"
                @call="onMakeOutgoingCall"
            />
            <div
                v-else
                className="flex min-h-[32px] bg-primary-bg justify-center items-center"
            >
                <img
                    v-if="bgLogoBase64"
                    :src="bgLogoBase64"
                    className="logo-image"
                >
            </div>
        </div>
        <ActionButtons
            v-if="!incomingUnansweredCall"
            :show-outgoing-button="isAnyActiveCall"
            :calls="activeCalls"
            @merge-click="onCallsMerge"
            @toggle-keypad="toggleManualKeypad"
            @key-press="onKeypadKeyPress"
        />
        <div
            v-if="showBottomKeypad"
            class="flex items-center justify-center p-2"
        >
            <Keypad @press="onKeypadKeyPress" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { watchDebounced } from '@vueuse/core'
import type { ICall } from 'opensips-js/src/types/rtc'
import ActionButtons from '@/components/ActionButtons.vue'
import TransferView from '@/views/TransferView.vue'
import RingingView from '@/views/RingingView.vue'
import { allowShrinkOnIdle, allowOutgoingCalls, bgLogoBase64, showKeypad, keypadMode, keypadPosition } from '@/composables/useWidgetConfig'
import { allActiveCalls, currentActiveRoom, useOpenSIPSJS } from '@/composables/opensipsjs'
import ActiveCallsView from '@/views/ActiveCallsView.vue'
import MoveView from '@/views/MoveView.vue'
import OutgoingCallView from '@/views/OutgoingCallView.vue'
import OutgoingCallInProgressView from '@/views/OutgoingCallInProgressView.vue'
import Keypad from '@/components/Keypad.vue'

const {
    transferCall,
    answerCall,
    moveCall,
    mergeCallsInRoom,
    startCall,
    terminateCall,
    sendDTMF,
    state
} = useOpenSIPSJS()

const transferringCall = ref<string>('')
const movingCall = ref<string>('')
const outgoingCallView = ref<typeof OutgoingCallView>()
const showManualKeypad = ref<boolean>(false)

const showTopKeypad = computed(() => {
    return showKeypad.value &&
        (keypadMode.value === 'static' || (keypadMode.value === 'manual' && showManualKeypad.value)) &&
        keypadPosition.value === 'top'
})

const showBottomKeypad = computed(() => {
    return showKeypad.value &&
        (keypadMode.value === 'static' || (keypadMode.value === 'manual' && showManualKeypad.value)) &&
        keypadPosition.value === 'bottom'
})

const isAnyActiveCall = computed(() => {
    return allActiveCalls.value.length > 0
})

const incomingUnansweredCall = computed(() => {
    return allActiveCalls.value.find((call: ICall) => {
        return call.direction === 'incoming' && !call._is_confirmed && !call._is_canceled
    })
})

const outgoingUnansweredCall = computed(() => {
    const outgoingCallObject = allActiveCalls.value.find((call: ICall) => {
        return call.direction === 'outgoing' && !call._is_confirmed && !call._is_canceled
    })

    return outgoingCallObject
})

const activeCalls = computed(() => {
    const activeCallObjects: Array<ICall> = allActiveCalls.value
        .filter((call: ICall) => {
            return call._is_confirmed
        })

    return activeCallObjects
})

const wrapperClasses = computed(() => {
    const baseClasses = 'min-h-[60px] bg-primary-bg'
    if (allowShrinkOnIdle.value && !isAnyActiveCall.value) {
        return `${baseClasses} min-w-[116px]`
    } else {
        return `${baseClasses} min-w-[354px]`
    }
})

watch(isAnyActiveCall, (value) => {
    if (!value) {
        cancelTransferring()
        cancelMoving()
    }
}, { deep: true })

watchDebounced(
    incomingUnansweredCall,
    (incomingCallObject) => {
        try {
            if (state?.opensipsjs?.audio.autoAnswer && incomingCallObject) {
                answerCall(incomingCallObject._id)
            }
        } catch (err) {
            console.error(err)
        }
    },
    {
        debounce: 1000,
        maxWait: 1000
    },
)

const toggleManualKeypad = () => {
    showManualKeypad.value = !showManualKeypad.value
}

const onKeypadKeyPress = (key: string) => {
    const callsInRoom = activeCalls.value.filter((call) => call.roomId === currentActiveRoom.value)
    if (callsInRoom.length === 1) {
        sendDTMF(callsInRoom[0]._id, key)
        return
    }

    if (outgoingCallView.value) {
        outgoingCallView.value.typeDigit(key)
    }
}

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

const onMakeOutgoingCall = (target: string) => {
    startCall(target)
}

const onOutgoingCallHangup = () => {
    const callId = outgoingUnansweredCall.value?._id
    if (!callId) {
        return
    }

    terminateCall(callId)
}

</script>

<style scoped>

</style>

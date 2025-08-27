<template>
    <div :class="wrapperClasses">
        <div
            v-if="showTopKeypad"
            class="p-2 border-b-1 border-border-lines"
        >
            <Keypad
                :is-add-caller-type="isAddCallerKeypadType"
                :is-new-call-type="isNewCallKeypadType"
                @press="onKeypadKeyPress"
                @call="onStartCall"
            />
        </div>
        <RingingView
            v-if="incomingUnansweredCall && !transferringCall"
            :call="incomingUnansweredCall"
            @transfer-click="onTransferClick(incomingUnansweredCall)"
        />
        <!--        <div v-if="outgoingUnansweredCall && !incomingUnansweredCall">
            <OutgoingCallInProgressView
                :number="outgoingUnansweredCall?._remote_identity?._uri?._user"
                @hangup="onOutgoingCallHangup"
            />
        </div>-->
        <ActiveCallsView
            v-show="!transferringCall &&
                !movingCall &&
                !incomingUnansweredCall &&
                isAnyActiveCall
            "
            ref="activeCallsView"
            :calls="activeCalls"
            @transfer-click="onTransferClick"
            @move-click="onMoveClick"
            @toggle-keypad="onToggleAddCallerKeypad"
        />
        <TransferView
            v-if="transferringCall"
            :call="transferringCall"
            @transfer="onCallTransfer"
            @cancel="cancelTransferring"
        />
        <MoveView
            v-if="movingCall"
            :call="movingCall"
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
                class="flex min-h-[32px] bg-primary-bg justify-center items-center"
            >
                <img
                    v-if="bgLogoBase64"
                    :src="bgLogoBase64"
                    class="logo-image"
                >
            </div>
        </div>
        <ActionButtons
            v-if="!incomingUnansweredCall && !transferringCall && !movingCall"
            :show-outgoing-button="isAnyActiveCall"
            :calls="activeCalls"
            @merge-click="onCallsMerge"
            @toggle-keypad="toggleManualKeypad"
            @toggle-new-call-keypad="onToggleNewCallKeypad"
            @key-press="onKeypadKeyPress"
            @start-call="onStartOutgoingCall"
        />
        <div
            v-if="showBottomKeypad"
            class="p-2"
        >
            <Keypad
                :is-add-caller-type="isAddCallerKeypadType"
                :is-new-call-type="isNewCallKeypadType"
                @press="onKeypadKeyPress"
                @call="onStartCall"
            />
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
import Keypad from '@/components/Keypad.vue'

const {
    transferCall,
    answerCall,
    moveCall,
    mergeCallsInRoom,
    startCall,
    terminateCall,
    sendDTMF,
    setActiveRoom,
    state
} = useOpenSIPSJS()

const transferringCall = ref<ICall | null>(null)
const movingCall = ref<ICall | null>(null)
const outgoingCallView = ref<typeof OutgoingCallView>()
const activeCallsView = ref<typeof ActiveCallsView>()
const showManualKeypad = ref<boolean>(false)
const isAddCallerKeypadType = ref<boolean>(false)
const isNewCallKeypadType = ref<boolean>(false)

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

function onStartOutgoingCall () {
    if (outgoingCallView.value) {
        outgoingCallView.value.startCall()
    }
}

const toggleManualKeypad = () => {
    isAddCallerKeypadType.value = false
    isNewCallKeypadType.value = false

    showManualKeypad.value = !showManualKeypad.value

    //isAddCallerKeypadType.value = false
    //isNewCallKeypadType.value = false
}

function onToggleAddCallerKeypad () {
    if (!isAddCallerKeypadType.value && showManualKeypad.value) {
        isAddCallerKeypadType.value = true
        isNewCallKeypadType.value = false
        showManualKeypad.value = true
        return
    }
    showManualKeypad.value = !showManualKeypad.value

    isAddCallerKeypadType.value = showManualKeypad.value

    /*if (showManualKeypad.value) {
        isAddCallerKeypadType.value = true
    } else {
        isAddCallerKeypadType.value = false
    }*/
}

function onToggleNewCallKeypad () {
    if (!isNewCallKeypadType.value && showManualKeypad.value) {
        isNewCallKeypadType.value = true
        isAddCallerKeypadType.value = false
        showManualKeypad.value = true
        return
    }

    showManualKeypad.value = !showManualKeypad.value

    isNewCallKeypadType.value = showManualKeypad.value
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

function onStartCall (target: string) {
    if (isAddCallerKeypadType.value) {
        startCall(target, true)
        return
    }

    if (isNewCallKeypadType.value) {
        startCall(target)
        return
    }
}

const onTransferClick = (call: ICall) => {
    transferringCall.value = call
}

const cancelTransferring = () => {
    transferringCall.value = null
}

const onMoveClick = (call: ICall) => {
    movingCall.value = call
}

const cancelMoving = () => {
    movingCall.value = null
}

const onCallTransfer = (target: string) => {
    if (!transferringCall.value) {
        return
    }

    transferCall(transferringCall.value._id, target)
    transferringCall.value = null
}

const onCallMove = (targetRoom: number) => {
    if (!movingCall.value) {
        return
    }

    moveCall(movingCall.value._id, targetRoom)
    movingCall.value = null

    //const callsInRoom = activeCalls.value.filter((call) => call.roomId === currentActiveRoom.value)

    setActiveRoom(undefined)
    activeCallsView.value?.switchRoomListView(true)
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

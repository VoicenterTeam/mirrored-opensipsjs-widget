<template>
    <div class="flex items-center w-full p-1">
        <div class="pr-1">
            <ActionIconButton
                :icon="call.localMuted ? 'vc-lc-mic-off': 'vc-lc-mic'"
                :color="call.localMuted ? 'btn-filled-text': 'primary-actions'"
                :bg-color="call.localMuted ? 'destructive-actions': 'primary-actions-bg--focus'"
                rounded
                @click="doMuteCaller"
            />
        </div>

        <div
            class="flex text-xs text-main-text font-medium"
            style="width: 190px; max-width: 190px;"
        >
            <div
                v-if="displayCallerInfoName && callerName"
                class="w-1/2 max-w-1/2 truncate"
            >
                {{ callerName }}
            </div>
            <div
                v-if="displayCallerInfoId && callerNumber"
                class="w-1/2 truncate"
            >
                {{ callerNumber }}
            </div>
        </div>


        <!--        <div className="flex items-center mx-1">
            <IncomingCallActionButton
                v-if="!props.call.localMuted"
                color="primary"
                :icon="SoundOnIcon"
                :size="soundOnIconSize"
                @click="doMuteCaller"
            />
            <IncomingCallActionButton
                v-else
                color="primary"
                :icon="SoundOffIcon"
                :size="soundOffIconSize"
                @click="unmuteCaller"
            />
        </div>-->

        <div className="mx-2 w-[46px] text-xs text-main-text">
            {{ callTime }}
        </div>

        <!--        <div className="flex mx-1">
            <IncomingCallActionButton
                v-if="!isOnLocalHold"
                color="primary"
                :icon="HoldIcon"
                :size="holdIconSize"
                @click="putOnHold"
            />
            <IncomingCallActionButton
                v-else
                color="primary"
                :icon="OnHoldIcon"
                :size="holdIconSize"
                @click="unHoldCall"
            />
        </div>-->

        <!--        <div className="mx-2">
            <IncomingCallActionButton
                color="danger"
                hover-color="additional-danger-bg"
                :icon="DeclineIcon"
                :use-padding="!isMultiCallMode"
                :additional-classes="declineButtonClasses"
                :size="declineIconSize"
                @click="declineIncomingCall"
            />
        </div>-->

        <!--        <OptionActionButton icon="vc-lc-ellipsis-vertical" />-->
        <CallOptionsButton />
        <!--        <div v-if="!props.isSingleRoom || props.isSingleRoom && allowTransfer">
            <CallOptionsIconButton
                :is-single-room="props.isSingleRoom"
                :is-multi-call-mode="isMultiCallMode"
                :button-classes="callOptionsButtonClasses"
                @transfer-click="onTransferClick"
                @move-click="onMoveClick"
            />
        </div>-->

        <div
            v-if="showAddCallerButton"
            class="ml-1"
        >
            <AddCallerButton />
        </div>

        <div
            v-if="showSwitchRoomButton"
            class="ml-1"
        >
            <RoomActionButton
                icon="vc-lc-arrow-right-left"
                label="SWITCH"
                @click="onSwitchRoomButtonClick"
            />
        </div>

        <div class="pl-1">
            <ActionIconButton
                icon="vc-icon-phone-down"
                color="white"
                bg-color="destructive-actions"
                rounded
                @click="onHangupCall"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import type { UnwrapRef } from 'vue'
import DeclineIcon from '@/assets/icons/decline.svg?component'
import HoldIcon from '@/assets/icons/hold.svg?component'
import OnHoldIcon from '@/assets/icons/onHold.svg?component'
import SoundOnIcon from '@/assets/icons/soundOn.svg?component'
import SoundOffIcon from '@/assets/icons/soundOff.svg?component'
import IncomingCallActionButton from '@/components/base/IncomingCallActionButton.vue'
import CallOptionsIconButton from '@/components/CallOptionsIconButton.vue'
import type { ICall } from 'opensips-js/src/types/rtc'
import { useOpenSIPSJS, callTimes, allRooms, allActiveCalls } from '@/composables/opensipsjs'
import useCallInfo from '@/composables/useCallInfo'
import { getFormattedTimeFromSeconds } from '@/helpers/timeHelper'
import { allowTransfer, displayCallerInfoId, displayCallerInfoName } from '@/composables/useWidgetConfig'
import RoomActionButton from '@/components/base/RoomActionButton.vue'
import AddCallerButton from '@/components/AddCallerButton.vue'
import OptionActionButton from '@/components/base/OptionActionButton.vue'
import ActionIconButton from '@/components/base/ActionIconButton.vue'
import CallOptionsButton from '@/components/CallOptionsButton.vue'

const props = withDefaults(
    defineProps<{
        call: UnwrapRef<ICall>
        isFirstCaller: boolean
        isSingleCall: boolean
        isSingleRoom: boolean
    }>(),
    {}
)

/* Composables */
const { terminateCall, holdCall, unholdCall, muteCaller } = useOpenSIPSJS()
const { callerNumber, callerName } = useCallInfo(props.call)

const emit = defineEmits<{
    (e: 'transfer-click', callId: string): void
    (e: 'move-click', callId: string): void
    (e: 'terminate-call'): void
    (e: 'open-room-list'): void
}>()

const isOnLocalHold = ref<boolean>(false)

const isMultiCallMode = computed(() => {
    return !props.isSingleCall || !props.isSingleRoom
})

const showAddCallerButton = computed(() => {
    return allActiveCalls.value.length === 1
})

const showSwitchRoomButton = computed(() => {
    return allActiveCalls.value.length === 1 && allRooms.value.length > 1
})

const holdIconSize = computed(() => {
    return isMultiCallMode.value ? 'base' : 'xl'
})

const soundOnIconSize = computed(() => {
    return isMultiCallMode.value ? 'base-sm' : 'xl-base'
})

const soundOffIconSize = computed(() => {
    return isMultiCallMode.value ? 'base' : 'xl-lg'
})

const declineIconSize = computed(() => {
    return isMultiCallMode.value ? 'base' : 'xxxl'
})

const callOptionsButtonClasses = computed(() => {
    return isMultiCallMode.value ? 'p-0.5' : ''
})

const declineButtonClasses = computed(() => {
    return isMultiCallMode.value ? 'p-0.5' : ''
})

const wrapperClasses = computed(() => {
    let baseClasses = 'flex w-full items-center p-1 '

    if (isMultiCallMode.value) {
        baseClasses += 'h-[20px] justify-between '
    } else {
        baseClasses += 'h-[40px] '
    }

    if (allRooms.value.length > 1) {
        baseClasses += ' room-button-gradient justify-between'
    }

    if (props.isSingleRoom) {
        if (props.isSingleCall) {
            return baseClasses
        } else {
            return props.isFirstCaller ? baseClasses : baseClasses + ' border-t border-t-border-lines'
        }
    } else {
        if (props.isSingleCall) {
            return baseClasses + ' border-t border-t-border-lines'
        } else {
            return props.isFirstCaller ? baseClasses : baseClasses + ' border-t border-t-border-lines'
        }
    }
})

const callTime = computed(() => {
    const time = callTimes.value[props.call._id]
    return getFormattedTimeFromSeconds(time)
})

function onSwitchRoomButtonClick () {
    emit('open-room-list')
}

function onHangupCall () {
    terminateCall(props.call._id)
    emit('terminate-call')
}

const putOnHold = () => {
    holdCall(props.call._id)
    isOnLocalHold.value = true
}

const unHoldCall = () => {
    unholdCall(props.call._id)
    isOnLocalHold.value = false
}

const doMuteCaller = () => {
    muteCaller(props.call._id, !props.call.localMuted)
}

/*const unmuteCaller = () => {
    muteCaller(props.call._id, false)
}*/

const declineIncomingCall = () => {
    terminateCall(props.call._id)
}

const onTransferClick = () => {
    emit('transfer-click', props.call._id)
}

const onMoveClick = () => {
    emit('move-click', props.call._id)
}

onMounted(() => {
    if (props.call) {
        isOnLocalHold.value = props.call.isOnHold().local
    }
})

</script>

<style scoped>

</style>

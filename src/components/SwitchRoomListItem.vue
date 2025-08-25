<template>
    <div class="flex justify-between items-center h-10 p-1">
        <div class="flex">
            <OptionActionButton
                v-if="isActive"
                icon="vc-lc-circle-pause"
                size="2xl"
                @click="onExitRoom"
            />
            <OptionActionButton
                v-else
                icon="vc-lc-log-in"
                size="2xl"
                @click="onSwitchRoom"
            />
            <div
                class="pl-2 truncate"
                style="max-width: 200px;"
            >
                {{ identifier }}
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

        <div class="flex">
            <div className="flex items-center mx-2 w-[46px]">
                <span className="text-xs text-main-text">
                    {{ callTime }}
                </span>
            </div>

            <!--            <div className="flex items-center mx-1">
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

            <!--            <OptionActionButton icon="vc-lc-ellipsis-vertical" />-->

            <!--        <div v-if="!props.isSingleRoom || props.isSingleRoom && allowTransfer">
            <CallOptionsIconButton
                :is-single-room="props.isSingleRoom"
                :is-multi-call-mode="isMultiCallMode"
                :button-classes="callOptionsButtonClasses"
                @transfer-click="onTransferClick"
                @move-click="onMoveClick"
            />
        </div>-->
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
import { useOpenSIPSJS, callTimes, allRooms } from '@/composables/opensipsjs'
import useCallInfo from '@/composables/useCallInfo'
import { getFormattedTimeFromSeconds } from '@/helpers/timeHelper'
import { allowTransfer, displayCallerInfoId, displayCallerInfoName } from '@/composables/useWidgetConfig'
import RoomActionButton from '@/components/base/RoomActionButton.vue'
import AddCallerButton from '@/components/AddCallerButton.vue'
import OptionActionButton from '@/components/base/OptionActionButton.vue'

const props = withDefaults(
    defineProps<{
        roomId: number
        isActive: boolean
        identifier: string
        oldestCallId: string
    }>(),
    {}
)

/* Composables */
const { terminateCall, holdCall, unholdCall, muteCaller } = useOpenSIPSJS()
const { callerNumber, callerName } = useCallInfo(props.call)

const emit = defineEmits<{
    (e: 'transfer-click', callId: string): void
    (e: 'move-click', callId: string): void
    (e: 'open-room-list'): void
    (e: 'switch-room'): void
    (e: 'exit-room'): void
}>()

const isOnLocalHold = ref<boolean>(false)

const isMultiCallMode = computed(() => {
    return !props.isSingleCall || !props.isSingleRoom
})

const holdIconSize = computed(() => {
    return isMultiCallMode.value ? 'base' : 'xl'
})

const callTime = computed(() => {
    const time = callTimes.value[props.oldestCallId]
    return getFormattedTimeFromSeconds(time)
})

function onExitRoom () {
    emit('exit-room')
}

function onSwitchRoom () {
    emit('switch-room')
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
    muteCaller(props.call._id, true)
}

const unmuteCaller = () => {
    muteCaller(props.call._id, false)
}

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

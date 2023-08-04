<template>
    <div :className="wrapperClasses">
        <div className="flex items-center w-[92px] mx-3">
            <span className="text-xs text-main-text font-medium">
                {{ callerNumber }}
            </span>
        </div>
        <div className="flex items-center mx-1">
            <IncomingCallActionButton
                v-if="!isOnLocalHold"
                color="primary"
                :icon="HoldIcon"
                size="xl"
                @click="putOnHold" />
            <IncomingCallActionButton
                v-else
                color="primary"
                :icon="OnHoldIcon"
                size="xl"
                @click="unHoldCall" />
        </div>
        <div className="flex items-center mx-1">
            <IncomingCallActionButton
                v-if="!props.call.localMuted"
                color="primary"
                :icon="MuteIcon"
                size="xl"
                @click="doMuteCaller" />
            <IncomingCallActionButton
                v-else
                color="primary"
                :icon="UnmuteIcon"
                size="xl"
                @click="unmuteCaller" />
        </div>

        <div className="flex items-center mx-2 w-[46px]">
            <span className="text-xs text-main-text font-medium">
                {{ callTime }}
            </span>
        </div>

        <div className="mx-2">
            <IncomingCallActionButton
                color="danger"
                hover-color="additional-danger-bg"
                :icon="DeclineIcon"
                size="xxxl"
                @click="declineIncomingCall" />
        </div>

        <div v-if="!props.isSingleRoom || props.isSingleRoom && allowTransfer">
            <CallOptionsIconButton
                :is-single-room="props.isSingleRoom"
                @transfer-click="onTransferClick"
                @move-click="onMoveClick"
            />
        </div>
    </div>

</template>

<script lang="ts" setup>
import type { UnwrapRef } from 'vue'
import DeclineIcon from '@/assets/icons/decline.svg?component'
import HoldIcon from '@/assets/icons/hold.svg?component'
import OnHoldIcon from '@/assets/icons/onHold.svg?component'
import MuteIcon from '@/assets/icons/mute.svg?component'
import UnmuteIcon from '@/assets/icons/unmute.svg?component'
import IncomingCallActionButton from '@/components/base/IncomingCallActionButton.vue'
import CallOptionsIconButton from '@/components/CallOptionsIconButton.vue'
import type { ICall } from '@voicenter-team/opensips-js/src/types/rtc'
import { useOpenSIPSJS, callTimes } from '@/composables/opensipsjs'
import { computed, onMounted, ref } from 'vue'
import { getFormattedTimeFromSeconds } from '@/helpers/timeHelper'

import MoveToCallIcon from '@/assets/icons/moveToCall.svg?component'
import TransferIcon from '@/assets/icons/transfer.svg?component'
import { allowTransfer, displayCallerInfoIdMask, displayCallerInfoName } from '@/composables/useCallSettingsPermissions'
import { getCallerInfo } from '@/helpers/callerHelper'

const { terminateCall, holdCall, muteCaller } = useOpenSIPSJS()

const props = withDefaults(
    defineProps<{
        call: UnwrapRef<ICall>
        isFirstCaller: boolean
        isSingleCall: boolean
        isSingleRoom: boolean
    }>(),
    {}
)

const emit = defineEmits<{
    (e: 'transfer-click', callId: string): void
    (e: 'move-click', callId: string): void
}>()

const isOnLocalHold = ref<boolean>(false)

const wrapperClasses = computed(() => {
    const baseClasses = 'flex border-l'

    if (props.isSingleRoom) {
        if (props.isSingleCall) {
            return baseClasses
        } else {
            return props.isFirstCaller ? baseClasses : baseClasses + ' border-t'
        }
    } else {
        if (props.isSingleCall) {
            return baseClasses + ' border-t'
        } else {
            return props.isFirstCaller ? baseClasses : baseClasses + ' border-t'
        }
    }
})

const callTime = computed(() => {
    const time = callTimes.value[props.call._id]
    return getFormattedTimeFromSeconds(time)
})

const callerNumber = computed(() => {
    const cNumber = props.call?._remote_identity._uri._user as string
    const cName = props.call?._remote_identity._display_name as string
    return getCallerInfo(cNumber, cName, displayCallerInfoName.value, displayCallerInfoIdMask.value)
})

const putOnHold = () => {
    holdCall({ callId: props.call._id, toHold: true })
    isOnLocalHold.value = true
}

const unHoldCall = () => {
    holdCall({ callId: props.call._id, toHold: false })
    isOnLocalHold.value = false
}

const doMuteCaller = () => {
    muteCaller(props.call._id, true)
}

const unmuteCaller = () => {
    muteCaller(props.call._id, false)
}

const declineIncomingCall = () => {
    console.log('declineIncomingCall', props.call._id)
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

<template>
    <div :className="wrapperClasses">
        <div  v-if="!isMultiCallMode" className="flex flex-col items-center justify-evenly w-[92px] mx-3">
            <span v-if="displayCallerInfoName" className="text-xs text-main-text font-medium">
                {{ callerName }}
            </span>
            <span v-if="displayCallerInfoId" className="text-xs text-main-text font-medium">
                {{ callerNumber }}
            </span>
        </div>
        <div v-else className="p-0.5">
            <div className="overflow-hidden mx-3 text-main-text w-[92px] max-w-[92px] font-medium text-xs text-ellipsis whitespace-nowrap">
                {{callerName}} {{callerNumber}}
            </div>
        </div>
        <div className="flex items-center mx-1">
            <IncomingCallActionButton
                v-if="!isOnLocalHold"
                color="primary"
                :icon="HoldIcon"
                :size="holdIconSize"
                @click="putOnHold" />
            <IncomingCallActionButton
                v-else
                color="primary"
                :icon="OnHoldIcon"
                :size="holdIconSize"
                @click="unHoldCall" />
        </div>
        <div className="flex items-center mx-1">
            <IncomingCallActionButton
                v-if="!props.call.localMuted"
                color="primary"
                :icon="SoundOnIcon"
                :size="soundOnIconSize"
                @click="doMuteCaller" />
            <IncomingCallActionButton
                v-else
                color="primary"
                :icon="SoundOffIcon"
                :size="soundOffIconSize"
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
                :use-padding="!isMultiCallMode"
                :additional-classes="declineButtonClasses"
                :size="declineIconSize"
                @click="declineIncomingCall" />
        </div>

        <div v-if="!props.isSingleRoom || props.isSingleRoom && allowTransfer">
            <CallOptionsIconButton
                :is-single-room="props.isSingleRoom"
                :is-multi-call-mode="isMultiCallMode"
                :button-classes="callOptionsButtonClasses"
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
import SoundOnIcon from '@/assets/icons/soundOn.svg?component'
import SoundOffIcon from '@/assets/icons/soundOff.svg?component'
import IncomingCallActionButton from '@/components/base/IncomingCallActionButton.vue'
import CallOptionsIconButton from '@/components/CallOptionsIconButton.vue'
import type { ICall } from '@voicenter-team/opensips-js/src/types/rtc'
import { useOpenSIPSJS, callTimes, allRooms } from '@/composables/opensipsjs'
import { computed, onMounted, ref } from 'vue'
import { getFormattedTimeFromSeconds } from '@/helpers/timeHelper'

import { allowTransfer, displayCallerInfoId, displayCallerInfoIdMask, displayCallerInfoName } from '@/composables/useWidgetConfig'
import { getCallerNumber } from '@/helpers/callerHelper'

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

const isMultiCallMode = computed(() => {
    return !props.isSingleCall || !props.isSingleRoom
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
    let baseClasses = 'flex w-full '

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

const callerNumber = computed(() => {
    const cNumber = props.call?._remote_identity._uri._user as string
    // const cName = props.call?._remote_identity._display_name as string
    // return getCallerInfo(cNumber, cName, displayCallerInfoName.value, displayCallerInfoIdMask.value)
    return getCallerNumber(cNumber, displayCallerInfoIdMask.value)
})

const callerName = computed(() => {
    // const cNumber = props.call?._remote_identity._uri._user as string
    const cName = props.call?._remote_identity._display_name || '' as string
    // return getCallerInfo(cNumber, cName, displayCallerInfoName.value, displayCallerInfoIdMask.value)
    return cName
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

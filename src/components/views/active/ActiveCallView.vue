<template>
    <div className="flex">
        <div className="flex items-center mx-4">
            3809365434356<!--            {{ callerNumber }}-->
        </div>
        <div className="flex items-center mx-4">
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
        <div className="flex items-center mx-4">
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

        <div className="flex items-center mx-4">
            {{ callTime }}
        </div>

        <div>
            <IncomingCallActionButton
                color="danger"
                hover-color="additional-danger-bg"
                :icon="DeclineIcon"
                size="xxl"
                @click="declineIncomingCall" />
        </div>

        <div>
            <CallOptionsIconButton @transfer-click="onTransferClick" />
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

const { terminateCall, holdCall, muteCaller } = useOpenSIPSJS()

const props = withDefaults(
    defineProps<{
        call: UnwrapRef<ICall>
    }>(),
    {}
)

const emit = defineEmits<{
    (e: 'transfer-click', callId: string): void
}>()

const isOnLocalHold = ref<boolean>(false)


const callTime = computed(() => {
    const time = callTimes.value[props.call._id]
    return getFormattedTimeFromSeconds(time)
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

const callerNumber = computed(() => {
    return props.call?._remote_identity._uri._user as string
})

const onTransferClick = () => {
    emit('transfer-click', props.call._id)
}

/*onMounted(() => {
    if (props.call) {
        isOnLocalHold.value = props.call.isOnHold().local
    }
})*/

</script>

<style scoped>

</style>

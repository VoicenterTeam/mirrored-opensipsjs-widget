<template>
    <div className="min-h-[40px] min-w-[354px] bg-primary-bg">
        <div className="flex min-h-[40px] justify-around items-center bg-primary-bg">
            <div v-if="outgoingUnansweredCall">
                <span class="text-base text-main-text font-medium">Dialing...</span>
            </div>
            <div v-else class="flex items-center justify-around w-full">
                <span class="text-base text-main-text font-medium">Customer Support</span>
                <div className="flex items-center mx-2 w-[46px]">
                    <span className="text-base text-main-text font-medium">
                        {{ callTime }}
                    </span>
                </div>
            </div>

            <div class="flex items-center px-2">
                <IncomingCallActionButton
                    v-if="isMuted"
                    color="primary"
                    :icon="UnMuteIcon"
                    @click="doMuteAgent" />
                <IncomingCallActionButton
                    v-else
                    color="primary"
                    :icon="MuteIcon"
                    @click="doMuteAgent" />

                <QuickCallSettingsButton />

                <IncomingCallActionButton
                    color="danger"
                    hover-color="additional-danger-bg"
                    :icon="DeclineIcon"
                    size="lg"
                    @click="hangupCall" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { ICall } from '@voicenter-team/opensips-js/src/types/rtc'
import DeclineIcon from '@/assets/icons/decline.svg?component'
import { allActiveCalls, isMuted, callTimes, useOpenSIPSJS } from '@/composables/opensipsjs'
import IncomingCallActionButton from '@/components/base/IncomingCallActionButton.vue'
import QuickCallSettingsButton from '@/components/QuickCallSettingsButton.vue'
import MuteIcon from '@/assets/icons/mute.svg?component'
import UnMuteIcon from '@/assets/icons/unmute.svg?component'
import { getFormattedTimeFromSeconds } from '@/helpers/timeHelper'

const {
    terminateCall,
    muteAgent
} = useOpenSIPSJS()

const hangupCall = () => {
    const callId = allActiveCalls.value[0]._id

    terminateCall(callId)
}

const callTime = computed(() => {
    const call = allActiveCalls.value[0]

    if (call) {
        const time = callTimes.value[call._id]
        return getFormattedTimeFromSeconds(time)
    }

    return ''
})

const doMuteAgent = () => {
    muteAgent(!isMuted.value)
}

const outgoingUnansweredCall = computed(() => {
    const outgoingCallObject = allActiveCalls.value.find((call: ICall) => {
        return call.direction === 'outgoing' && !call._is_confirmed && !call._is_canceled
    })

    return outgoingCallObject
})

</script>

<style scoped>

</style>

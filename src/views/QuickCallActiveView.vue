<template>
    <div className="min-h-[40px] min-w-[354px] bg-primary-bg">
        <div
            v-if="showTopKeypad"
            class="flex items-center justify-center p-2 border-b-1 border-border-lines"
        >
            <Keypad @press="onKeypadKeyPress" />
        </div>
        <div className="flex min-h-[40px] justify-around items-center bg-primary-bg">
            <div v-if="outgoingUnansweredCall">
                <span class="text-base text-main-text font-medium">Dialing...</span>
            </div>
            <div
                v-else
                class="flex items-center justify-around w-full"
            >
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
                    @click="doMuteAgent"
                />
                <IncomingCallActionButton
                    v-else
                    color="primary"
                    :icon="MuteIcon"
                    @click="doMuteAgent"
                />

                <QuickCallSettingsButton />

                <IncomingCallActionButton
                    color="danger"
                    hover-color="additional-danger-bg"
                    :icon="DeclineIcon"
                    size="lg"
                    @click="hangupCall"
                />

                <div v-if="showKeypad && keypadMode === 'manual'">
                    <WidgetIconButton
                        color="primary"
                        pressed-color="primary-bg"
                        :icon="KeypadIcon"
                        :pressed="showManualKeypad"
                        @click="toggleManualKeypad"
                    />
                </div>
                <KeypadIconButton
                    v-if="showKeypad && keypadMode === 'popover'"
                    @press="onKeypadKeyPress"
                />
            </div>
        </div>
        <div
            v-if="showBottomKeypad"
            class="flex items-center justify-center p-2 border-t-1 border-border-lines"
        >
            <Keypad @press="onKeypadKeyPress" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import type { ICall } from 'opensips-js/src/types/rtc'
import DeclineIcon from '@/assets/icons/decline.svg?component'
import { allActiveCalls, isMuted, callTimes, currentActiveRoom, useOpenSIPSJS } from '@/composables/opensipsjs'
import IncomingCallActionButton from '@/components/base/IncomingCallActionButton.vue'
import QuickCallSettingsButton from '@/components/QuickCallSettingsButton.vue'
import WidgetIconButton from '@/components/base/WidgetIconButton.vue'
import KeypadIconButton from '@/components/KeypadIconButton.vue'
import Keypad from '@/components/Keypad.vue'
import MuteIcon from '@/assets/icons/mute.svg?component'
import UnMuteIcon from '@/assets/icons/unmute.svg?component'
import KeypadIcon from '@/assets/icons/keypad.svg?component'
import { getFormattedTimeFromSeconds } from '@/helpers/timeHelper'
import { keypadMode, keypadPosition, showKeypad } from '@/composables/useWidgetConfig'

const {
    terminateCall,
    muteAgent,
    sendDTMF
} = useOpenSIPSJS()

const showManualKeypad = ref<boolean>(false)

const hangupCall = () => {
    const callId = allActiveCalls.value[0]._id

    terminateCall(callId)
}

const onKeypadKeyPress = (key: string) => {
    const callsInRoom = activeCalls.value.filter((call) => call.roomId === currentActiveRoom.value)
    if (callsInRoom.length === 1) {
        sendDTMF(callsInRoom[0]._id, key)
    }
}

const toggleManualKeypad = () => {
    showManualKeypad.value = !showManualKeypad.value
}

const activeCalls = computed(() => {
    const activeCallObjects: Array<ICall> = allActiveCalls.value
        .filter((call: ICall) => {
            return call._is_confirmed
        })

    return activeCallObjects
})

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

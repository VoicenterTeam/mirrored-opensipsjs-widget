<template>
    <div className="flex min-h-[60px] justify-around items-center bg-primary-bg">
        <div className="flex flex-col items-center justify-evenly w-[92px] mx-3">
            <span
                v-if="displayCallerInfoName"
                className="text-xs text-main-text font-medium"
            >
                {{ displayName }}
            </span>
            <span
                v-if="displayCallerInfoId"
                className="text-xs text-main-text font-medium"
            >
                {{ displayNumber }}
            </span>
        </div>
        <div v-if="!call.autoAnswer">
            <IncomingCallActionButton
                color="success"
                hover-color="additional-success-bg"
                :icon="CallIcon"
                :disabled="answerClicked"
                size="xxxl"
                @click="answerIncomingCall"
            />
            <IncomingCallActionButton
                color="danger"
                hover-color="additional-danger-bg"
                :icon="DeclineIcon"
                size="xxxl"
                additional-classes=""
                @click="declineIncomingCall"
            />
            <IncomingCallActionButton
                v-if="allowTransfer"
                color="secondary"
                hover-color="secondary-text"
                :icon="TransferIcon"
                size="xxxl"
                additional-classes=""
                @click="transferIncomingCall"
            />
        </div>
        <div
            v-else
            class="flex"
        >
            <!--            Answering...-->
            <div className="flex items-center mx-2 w-[46px]">
                <span className="text-xs text-main-text font-medium">
                    {{ callTime }}
                </span>
            </div>

            <IncomingCallActionButton
                color="danger"
                hover-color="additional-danger-bg"
                :icon="DeclineIcon"
                size="xxxl"
                additional-classes=""
                @click="declineIncomingCall"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { UnwrapRef } from 'vue'
import CallIcon from '@/assets/icons/call.svg?component'
import DeclineIcon from '@/assets/icons/decline.svg?component'
import TransferIcon from '@/assets/icons/transferCall.svg?component'
import IncomingCallActionButton from '@/components/base/IncomingCallActionButton.vue'
import type { ICall } from 'opensips-js/src/types/rtc'
import { useOpenSIPSJS } from '@/composables/opensipsjs'
import { callTimes } from '@/composables/opensipsjs'
import useCallInfo from '@/composables/useCallInfo'
import { ref, onMounted, computed } from 'vue'
import {
    displayCallerInfoName,
    displayCallerInfoId,
    allowTransfer
} from '@/composables/useWidgetConfig'
import { getFormattedTimeFromSeconds } from '@/helpers/timeHelper'
import useRingingSound from '@/composables/useRingingSound.ts'

const props = withDefaults(
    defineProps<{
        call: UnwrapRef<ICall>
    }>(),
    {}
)

/* Emits */
const emit = defineEmits<{
    (e: 'transfer-click', callId: string): void
}>()

/* Composables */
const { answerCall, terminateCall } = useOpenSIPSJS()
const { displayNumber, displayName } = useCallInfo(props.call)
const { play, stop } = useRingingSound()

/* Computed */
const callTime = computed(() => {
    const time = callTimes.value[props.call._id]
    return getFormattedTimeFromSeconds(time)
})

/* Data */
const answerClicked = ref(false)

/* Methods */
const answerIncomingCall = () => {
    answerCall(props.call._id)
    stop()
    answerClicked.value = true
}
const declineIncomingCall = () => {
    terminateCall(props.call._id)
}
const transferIncomingCall = () => {
    const callId = props.call?._id
    emit('transfer-click', callId)
}

onMounted(() => {
    play()
})
</script>

<style scoped>

</style>

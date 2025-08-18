<template>
    <div
        class="p-1.5"
    >
        <div
            class="flex p-1"
            style="box-shadow: 0 0 6px rgba(0,0,0,0.1); border-radius: 5px;"
        >
            <div class="w-full">
                <div
                    class="flex text-sm text-main-text font-medium"
                    style="width: 220px; max-width: 220px;"
                >
                    <span
                        v-if="displayCallerInfoName && callerName"
                        class="w-1/2 max-w-1/2 truncate"
                    >
                        {{ callerName }}
                    </span>
                    <span
                        v-if="displayCallerInfoId && callerNumber"
                        class="w-1/2 max-w-1/2 truncate"
                    >
                        {{ callerNumber }}
                    </span>
                </div>
                <div class="text-xs text-inactive-text font-semibold">
                    {{ getTranslation('audio.incoming.call').toUpperCase() }}
                </div>
            </div>
            <div
                v-if="!call.autoAnswer"
                class="flex items-center"
            >
                <div>
                    <ActionIconButton
                        icon="vc-icon-phone"
                        color="white"
                        bg-color="success-actions"
                        rounded
                        :disabled="answerClicked"
                        @click="answerIncomingCall"
                    />
                </div>
                <div class="ml-1">
                    <ActionIconButton
                        icon="vc-icon-phone-down"
                        color="white"
                        bg-color="destructive-actions"
                        rounded
                        @click="declineIncomingCall"
                    />
                </div>
                <div
                    v-if="allowTransfer"
                    class="mx-1"
                >
                    <ActionIconButton
                        icon="vc-lc-redo-2"
                        color="primary-actions"
                        bg-color="inactive-elements-bg--focus"
                        size="sm"
                        rounded
                        @click="transferIncomingCall"
                    />
                </div>

                <!--                <IncomingCallActionButton
                    v-if="allowTransfer"
                    color="secondary"
                    hover-color="secondary-text"
                    :icon="TransferIcon"
                    size="xxxl"
                    additional-classes=""
                    @click="transferIncomingCall"
                />-->
            </div>
            <div
                v-else
                class="flex"
            >
                <!--            Answering...-->
                <div className="flex items-center mx-2 w-[46px]">
                    <span className="text-xs text-main-text">
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
import { ref, onMounted, onUnmounted, computed } from 'vue'
import {
    displayCallerInfoName,
    displayCallerInfoId,
    ringingSoundBase64,
    allowTransfer
} from '@/composables/useWidgetConfig'
import { defaultRingingSound } from '@/utils/ringingSound'
import { getFormattedTimeFromSeconds } from '@/helpers/timeHelper'
import { getTranslation } from '@/plugins/translator'
import ActionIconButton from '@/components/base/ActionIconButton.vue'

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
const { callerNumber, callerName } = useCallInfo(props.call)

/* Computed */
const callTime = computed(() => {
    const time = callTimes.value[props.call._id]
    return getFormattedTimeFromSeconds(time)
})

/* Data */
const df = ref<DocumentFragment | undefined>()
const soundEl = ref<HTMLAudioElement | undefined>()
const answerClicked = ref(false)

/* Methods */
const answerIncomingCall = () => {
    answerCall(props.call._id)
    stopRingingSound()
    answerClicked.value = true
}

const declineIncomingCall = () => {
    terminateCall(props.call._id)
}

const transferIncomingCall = () => {
    const callId = props.call?._id
    emit('transfer-click', callId)
}
const playRingingSound = (src: string) => {
    df.value = document.createDocumentFragment()
    soundEl.value = new Audio(src)
    df.value.appendChild(soundEl.value) // keep in fragment until finished playing
    soundEl.value.addEventListener('ended', function () {
        // df.removeChild(snd)
        soundEl.value?.play()
    })
    soundEl.value.play()
    return soundEl.value
}
const stopRingingSound = () => {
    if (soundEl.value) {
        soundEl.value?.pause()

        df.value?.removeChild(soundEl.value)

        soundEl.value = undefined
    }
}

onMounted(() => {
    if (ringingSoundBase64.value) {
        playRingingSound(ringingSoundBase64.value)
    } else {
        playRingingSound(defaultRingingSound)
    }

})

onUnmounted(() => {
    stopRingingSound()
})

</script>

<style scoped>

</style>

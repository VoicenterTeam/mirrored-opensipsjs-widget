<template>
    <div className="flex min-h-[60px] justify-around items-center bg-primary-bg">
        <div className="flex flex-col items-center justify-evenly w-[92px] mx-3">
            <span v-if="displayCallerInfoName" className="text-xs text-main-text font-medium">
                {{ callerName }}
            </span>
            <span v-if="displayCallerInfoId" className="text-xs text-main-text font-medium">
                {{ callerNumber }}
            </span>
        </div>
        <div v-if="!call.autoAnswer">
            <IncomingCallActionButton
                color="success"
                hover-color="additional-success-bg"
                :icon="CallIcon"
                :disabled="answerClicked"
                size="xxxl"
                @click="answerIncomingCall" />
            <IncomingCallActionButton
                color="danger"
                hover-color="additional-danger-bg"
                :icon="DeclineIcon"
                size="xxxl"
                additional-classes=""
                @click="declineIncomingCall" />
            <IncomingCallActionButton
                v-if="allowTransfer"
                color="secondary"
                hover-color="secondary-text"
                :icon="TransferIcon"
                size="xxxl"
                additional-classes=""
                @click="transferIncomingCall" />
        </div>
        <div v-else>
            Answering...
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { UnwrapRef } from 'vue'
import CallIcon from '@/assets/icons/call.svg?component'
import DeclineIcon from '@/assets/icons/decline.svg?component'
import TransferIcon from '@/assets/icons/transferCall.svg?component'
import IncomingCallActionButton from '@/components/base/IncomingCallActionButton.vue'
import type { ICall } from '@voicenter-team/opensips-js/src/types/rtc'
import { useOpenSIPSJS } from '@/composables/opensipsjs'
import useCallInfo from '@/composables/useCallInfo'
import { ref, onMounted, onUnmounted } from 'vue'
import {
    displayCallerInfoName,
    displayCallerInfoId,
    ringingSoundBase64,
    allowTransfer
} from '@/composables/useWidgetConfig'
import { defaultRingingSound } from '@/utils/ringingSound'

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

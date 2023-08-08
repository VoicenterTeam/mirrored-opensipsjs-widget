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
        <div>
            <IncomingCallActionButton
                color="success"
                hover-color="additional-success-bg"
                :icon="CallIcon"
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
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { getCallerNumber } from '@/helpers/callerHelper'
import {
    displayCallerInfoName,
    displayCallerInfoIdMask,
    displayCallerInfoId,
    ringingSoundBase64,
    allowTransfer
} from '@/composables/useCallSettingsPermissions'

const { answerCall, terminateCall } = useOpenSIPSJS()

const props = withDefaults(
    defineProps<{
        call: UnwrapRef<ICall>
    }>(),
    {}
)

const emit = defineEmits<{
    (e: 'transfer-click', callId: string): void
}>()

const answerIncomingCall = () => {
    answerCall(props.call._id)

}

const declineIncomingCall = () => {
    terminateCall(props.call._id)
}

const transferIncomingCall = () => {
    const callId = props.call?._id
    emit('transfer-click', callId)
}

const callerNumber = computed(() => {
    const cNumber = props.call?._remote_identity?._uri._user || '' as string
    // const cName = props.call?._remote_identity._display_name as string
    // return getCallerInfo(cNumber, cName, displayCallerInfoName.value, displayCallerInfoIdMask.value)
    return getCallerNumber(cNumber, displayCallerInfoIdMask.value)
})

const callerName = computed(() => {
    // const cNumber = props.call?._remote_identity._uri._user as string
    const cName = props.call?._remote_identity?._display_name || '' as string
    // return getCallerInfo(cNumber, cName, displayCallerInfoName.value, displayCallerInfoIdMask.value)
    return cName
})

const df = ref<DocumentFragment | undefined>()
const soundEl = ref<HTMLAudioElement | undefined>()

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

onMounted(() => {
    playRingingSound(ringingSoundBase64.value)
})

onUnmounted(() => {
    soundEl.value?.pause()
    if (soundEl.value) {
        df.value?.removeChild(soundEl.value)
    }
})

</script>

<style scoped>

</style>

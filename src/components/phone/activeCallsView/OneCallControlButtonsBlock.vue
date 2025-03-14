<template>
    <div class="keypad-wrapper w-full gap-x-5 gap-y-8">
        <CallActionButton
            v-for="(button, index) in oneActiveCallButtons"
            :key="index"
            :type="button.type"
            :src="button.src"
            :name="button.name"
            @click="button.action"
        />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CallActionButton from '@/components/phone/activeCallsView/CallActionButton.vue'
import { ControlButtonObjectType } from '@/types/phone'
import { isMuted, useOpenSIPSJS } from '@/composables/opensipsjs'
import { KeyPadTriggerObjectType } from '@/constants/phone.ts'
import { usePhoneState } from '@/composables/phone/usePhoneState.ts'
import { useVsipInject } from '@/composables/phone/useVsipProvideInject.ts'

/* Data */
const { holdCall, unholdCall, muteAgent } = useOpenSIPSJS()
const { callsInActiveRoom } = useVsipInject()
const  { onKeyPadToggle } = usePhoneState()
// const {  onCallToTransferChange } = useCallTransfer()

/* Methods */
const currentCall = computed(() => {
    return callsInActiveRoom.value[0] || {}
})
// const handleCallTransfer = () => {
//     onCallToTransferChange(currentCall.value._id)
// }

const oneActiveCallButtons = computed(() => {
    const buttons: ControlButtonObjectType[]  = [
        {
            type: 'blueButton',
            src: 'vc-lc-user-plus',
            name: 'add caller',
            action: () => onKeyPadToggle(KeyPadTriggerObjectType.add_caller)
        },
        // {
        //     type: 'blueButton',
        //     src: 'vc-lc-forward',
        //     name: 'transfer',
        //     action: () => handleCallTransfer()
        // },
        {
            type: isMuted.value ? 'redButton-with-bg': 'whiteButton',
            src: 'vc-lc-mic',
            name: isMuted.value ? 'muted' : 'mute',
            action: () => muteAgent(!isMuted.value)
        },
        {
            type: currentCall.value._localHold ? 'redButton-with-bg': 'whiteButton',
            src: 'vc-lc-play',
            name: 'hold',
            action: () => currentCall.value._localHold ? unholdCall(currentCall.value._id) : holdCall(currentCall.value._id)
        },
        {
            type: 'blueButton',
            src: 'vc-lc-grip',
            name: 'keypad',
            action: () => onKeyPadToggle(KeyPadTriggerObjectType.keypad)
        },
    ]

    return buttons
})
</script>
<style lang="scss">
.keypad-wrapper {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

</style>


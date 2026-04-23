<template>
    <div
        ref="controlButtonsBlockRef"
        class="keypad-wrapper w-full"
        :class="[gridGapClass]"
    >
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
import { computed, ref } from 'vue'
import CallActionButton from '@/components/phone/activeCallsView/CallActionButton.vue'
import { ControlButtonObjectType } from '@/types/phone'
import { useOpenSIPSJS } from '@/composables/opensipsjs'
import { KeyPadTriggerObjectType } from '@/constants/phone.ts'
import useCallActions from '@/composables/phone/useCallActions.ts'
import { usePhoneState } from '@/composables/phone/usePhoneState.ts'
import { useMainWrapperHeight } from '@/composables/phone/useMainWrapperHeight'
import { getTranslation } from '@/plugins/translator'
import { allowTransfer } from '@/composables/useWidgetConfig'

/* Data */
const { getAudioApi, getAudioState } = useOpenSIPSJS()
const { isMuted,callsInActiveRoom } = getAudioState()
const { holdCall, unholdCall, muteAgent } = getAudioApi()

const  { onKeyPadToggle } = usePhoneState()
const {  onCallToTransferChange } = useCallActions()

const controlButtonsBlockRef = ref<HTMLElement | null>(null)
const { isCompactLayout, isXsLayout } = useMainWrapperHeight(controlButtonsBlockRef)

const gridGapClass = computed(() => {
    if (isXsLayout.value) {
        return 'gap-x-4 gap-y-1'
    }
    if (isCompactLayout.value) {
        return 'gap-x-3 gap-y-1'
    }
    return 'gap-x-3 gap-y-3'
})

/* Methods */
const currentCall = computed(() => {
    return callsInActiveRoom.value[0] || {}
})

const handleCallTransfer = () => {
    onCallToTransferChange(currentCall.value._id)
}

const oneActiveCallButtons = computed(() => {
    const buttons: ControlButtonObjectType[]  = [
        {
            type: 'blueButton',
            src: 'vc-lc-user-plus',
            name: getTranslation('audio.add.caller'),
            action: () => onKeyPadToggle(KeyPadTriggerObjectType.add_caller)
        },
        {
            type: 'blueButton',
            src: 'vc-lc-forward',
            name: getTranslation('audio.transfer'),
            action: () => handleCallTransfer()
        },
        {
            type: isMuted.value ? 'redButton-with-bg': 'whiteButton',
            src: 'vc-lc-mic',
            name: isMuted.value ? getTranslation('audio.muted') : getTranslation('audio.mute'),
            action: () => muteAgent(!isMuted.value)
        },
        {
            type: currentCall.value._localHold ? 'redButton-with-bg': 'whiteButton',
            src: 'vc-lc-play',
            name: getTranslation('audio.hold'),
            action: () => currentCall.value._localHold ? unholdCall(currentCall.value._id) : holdCall(currentCall.value._id)
        },
        {
            type: 'blueButton',
            src: 'vc-lc-grip',
            name: getTranslation('audio.keypad'),
            action: () => onKeyPadToggle(KeyPadTriggerObjectType.keypad)
        },
    ]

    if (!allowTransfer.value) {
        return buttons.filter((button) => button.name !== getTranslation('audio.transfer'))
    }

    return buttons
})
</script>
<style lang="scss">
.keypad-wrapper {
  align-self: center;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  max-width: 400px;
}

</style>


<template>
    <div class="active-calls-with-keypad-view-wrapper w-full flex flex-col h-full">
        <SoundManager class="mb-1" />
        <CallsCompactView
            v-if="roomsWithoutActive.length"
            :rooms-length="activeRoomsWithoutIncoming.length"
            :calls-length="lengthOfCallsWithoutIncoming"
        />
        <BackToCurrentCall
            v-if="currentActiveRoom"
            :room-id="currentActiveRoom"
        />
        <div
            class="trigger-block flex flex-col flex-1 justify-center p-1"
            :class="{'keypad_trigger-wrapper mb-2': triggerTitle}"
        >
            <span class="text-sm text-center mb-2">{{ triggerTitle }}</span>
            <div class="h-10 mb-3">
                <VcInput
                    :model-value="phoneNumber"
                    :placeholder="getTranslation('common.type.number')"
                    clearable
                    class="h-full"
                    @update:modelValue="onNumberInput"
                    @keyup.enter="initCall"
                />
            </div>
            <KeyPad />
        </div>
        <FooterBlock />
        <ActiveCallsPopup v-if="isActiveCallsPopupActive" />
    </div>
</template>
<script lang="ts" setup>
import { computed, watch } from 'vue'
import SoundManager from '@/components/phone/SoundManager.vue'
import CallsCompactView from '@/components/phone/common/CallsCompactView.vue'
import BackToCurrentCall from '@/components/phone/activeCallsWithKeypadView/BackToCurrentCall.vue'
import { usePhoneState } from '@/composables/phone/usePhoneState.ts'
import { keyPadTriggerTitlesConfig } from '@/constants/phone.ts'
import FooterBlock from '@/components/phone/FooterBlock.vue'
import ActiveCallsPopup from '@/components/phone/common/ActiveCallsPopup.vue'
import useCallActions from '@/composables/phone/useCallActions.ts'
import KeyPad from '@/components/phone/common/KeyPad.vue'
import { useOpenSIPSJS } from '@/composables/opensipsjs'
import { getTranslation } from '@/plugins/translator'

const { getAudioState } = useOpenSIPSJS()

const {
    currentActiveRoom,
    activeRoomsWithoutIncoming,
    roomsWithoutActive,
    lengthOfCallsWithoutIncoming,
} = getAudioState()

/* Data */
const { phoneNumber, keyPadTrigger, onNumberInput, isActiveCallsPopupActive, onActiveCallsPopupToggle } = usePhoneState()
const { initCall } = useCallActions()

/* Computed */
const triggerTitle = computed(() => {
    const trigger = keyPadTrigger.value
    return trigger ? getTranslation(keyPadTriggerTitlesConfig[trigger]) : ''
})


const showActiveCallsPopup = computed(() => {
    return roomsWithoutActive.value.length && !keyPadTrigger.value
})

/* Watchers */
watch(
    showActiveCallsPopup,
    (val) => {
        if(val) {
            onActiveCallsPopupToggle(true)
        }
    }, {
        immediate: true
    }
)

</script>
<style lang="scss" scoped>
.active-calls-with-keypad-view-wrapper {
  .trigger-block {
    &.keypad_trigger-wrapper {
      border-radius: 16px;
      border: 1px solid var(--ui-lines);
    }
  }
}
</style>

<template>
    <div
        ref="keypadViewRef"
        class="active-calls-with-keypad-view-wrapper w-full flex flex-col h-full"
    >
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
            class="trigger-block flex flex-col flex-1 p-1 min-h-0"
            :class="[
                isCompactLayout ? 'justify-start' : 'justify-center',
                { 'keypad_trigger-wrapper': triggerTitle, 'mb-2': triggerTitle && !isCompactLayout },
            ]"
        >
            <span
                class="text-sm text-center"
                :class="isCompactLayout ? 'mb-0' : 'mb-2'"
            >{{ triggerTitle }}</span>
            <div :class="isCompactLayout ? 'h-8 mb-1' : 'h-10 mb-3'">
                <VcInput
                    :model-value="phoneNumber"
                    :placeholder="getTranslation('common.type.number')"
                    clearable
                    class="h-full"
                    @update:modelValue="onKeypadNumberInput"
                    @keyup.enter="initCall"
                />
            </div>
            <KeyPad />
        </div>
        <FooterBlock class="shrink-0" />
        <ActiveCallsPopup v-if="isActiveCallsPopupActive" />
    </div>
</template>
<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import SoundManager from '@/components/phone/SoundManager.vue'
import CallsCompactView from '@/components/phone/common/CallsCompactView.vue'
import BackToCurrentCall from '@/components/phone/activeCallsWithKeypadView/BackToCurrentCall.vue'
import { usePhoneState } from '@/composables/phone/usePhoneState.ts'
import { KeyPadTriggerObjectType, keyPadTriggerTitlesConfig, MAX_NUMBER_DTMF_INPUT_LENGTH } from '@/constants/phone.ts'
import FooterBlock from '@/components/phone/FooterBlock.vue'
import ActiveCallsPopup from '@/components/phone/common/ActiveCallsPopup.vue'
import useCallActions from '@/composables/phone/useCallActions.ts'
import KeyPad from '@/components/phone/common/KeyPad.vue'
import { useOpenSIPSJS } from '@/composables/opensipsjs'
import { useMainWrapperHeight } from '@/composables/phone/useMainWrapperHeight'
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

const COMPACT_THRESHOLD_HEIGHT = 500

const keypadViewRef = ref<HTMLElement | null>(null)
const { mainWrapperHeight } = useMainWrapperHeight(keypadViewRef)

const isCompactLayout = computed(() => {
    const currentHeight = mainWrapperHeight.value
    const isShortWidget = !!currentHeight && currentHeight < COMPACT_THRESHOLD_HEIGHT
    const hasActiveRooms = activeRoomsWithoutIncoming.value.length > 0
    return isShortWidget && hasActiveRooms
})

/* Computed */
const triggerTitle = computed(() => {
    const trigger = keyPadTrigger.value
    return trigger ? getTranslation(keyPadTriggerTitlesConfig[trigger]) : ''
})


const showActiveCallsPopup = computed(() => {
    return roomsWithoutActive.value.length && !keyPadTrigger.value
})

function onKeypadNumberInput (value: string| number) {
    if (keyPadTrigger.value === KeyPadTriggerObjectType.keypad) {
        onNumberInput(value, MAX_NUMBER_DTMF_INPUT_LENGTH)
        return
    }

    onNumberInput(value)
}

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

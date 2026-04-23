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
            :class="{ 'mt-1 mb-1': isShrunkLayout }"
        />
        <div
            class="trigger-block flex flex-col min-h-0"
            :class="[
                triggerBlockLayoutClass,
                isShrunkLayout ? 'justify-start' : 'justify-center',
                { 'keypad_trigger-wrapper': triggerTitle, 'mb-2': triggerTitle && !isShrunkLayout },
            ]"
        >
            <span
                v-if="triggerTitle"
                class="text-center"
                :class="triggerTitleClass"
            >{{ triggerTitle }}</span>
            <div :class="inputWrapperClass">
                <VcInput
                    :model-value="phoneNumber"
                    :placeholder="getTranslation('common.type.number')"
                    clearable
                    class="h-full"
                    @update:modelValue="onKeypadNumberInput"
                    @keyup.enter="initCall"
                />
            </div>
            <KeyPad :class="keypadMarginClass" />
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

const keypadViewRef = ref<HTMLElement | null>(null)
const { isCompactLayout, isXsLayout } = useMainWrapperHeight(keypadViewRef)

const hasActiveRooms = computed(() => activeRoomsWithoutIncoming.value.length > 0)

const isShrunkLayout = computed(
    () => (isCompactLayout.value && hasActiveRooms.value) || isXsLayout.value
)

const triggerTitleClass = computed(() => {
    if (isXsLayout.value) {
        return 'text-xs mb-0'
    }
    if (isShrunkLayout.value) {
        return 'text-sm mb-0'
    }
    return 'text-sm mb-2'
})

const inputWrapperClass = computed(() => {
    if (isXsLayout.value) {
        return 'h-7 mb-1'
    }
    if (isShrunkLayout.value) {
        return 'h-8 mb-1'
    }
    return 'h-10 mb-3'
})

const triggerBlockLayoutClass = computed(() => {
    if (isXsLayout.value) {
        return 'px-1 py-0 mb-1'
    }
    return 'p-1 flex-1'
})

const keypadMarginClass = computed(() => {
    if (isXsLayout.value) {
        return 'mb-1'
    }
    if (isShrunkLayout.value) {
        return 'mb-2'
    }
    return ''
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

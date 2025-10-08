<template>
    <div class="active-calls-with-action-buttons flex flex-col h-full">
        <SoundManager class="mb-1" />
        <OneCallInActiveRoomView
            v-if="isOneActiveCallInActiveRoom"
        />
        <TwoAndMoreCallsInActiveRoomView
            v-if="isTwoAndMoreActiveCallsInActiveRoom"
        />
        <ActionsPopup
            v-if="actionsPopupType"
            :caller="displayName"
            :action-group-list="actionsConfig"
        />
        <ActiveCallsPopup v-if="isActiveCallsPopupActive" />
        <FooterActionsBlock
            class="py-6 px-5 mb-0"
        />
        <CallMovePopup v-if="callToMove" />
        <CallTransferPopup v-if="callToTransfer" />
    </div>
</template>
<script lang="ts" setup>
import { computed, watch } from 'vue'
import ActionsPopup from '@/components/phone/activeCallsView/ActionsPopup.vue'
import OneCallInActiveRoomView from '@/components/phone/activeCallsView/OneCallInActiveRoomView.vue'
import SoundManager from '@/components/phone/SoundManager.vue'
import CallMovePopup from '@/components/phone/activeCallsView/CallMovePopup.vue'
import CallTransferPopup from '@/components/phone/activeCallsView/CallTransferPopup.vue'
import FooterActionsBlock from '@/components/phone/activeCallsView/FooterActionsBlock.vue'
import TwoAndMoreCallsInActiveRoomView from '@/components/phone/activeCallsView/TwoAndMoreCallsInActiveRoomView.vue'
import useCallActions from '@/composables/phone/useCallActions.ts'
import { ActionsTriggerObjectType } from '@/constants/phone.ts'
import ActiveCallsPopup from '@/components/phone/common/ActiveCallsPopup.vue'
import { usePhoneState } from '@/composables/phone/usePhoneState.ts'
import { useOpenSIPSJS } from '@/composables/opensipsjs.ts'
import type { ICall } from 'opensips-js/src/types/rtc'
import useCallInfo from '@/composables/useCallInfo.ts'

const { getAudioState } = useOpenSIPSJS()
const { activeCalls, callsInActiveRoom } = getAudioState()

/* Data */
const { actionsPopupType, actionsConfig, callToMove, callToTransfer,  onActionsToggle, onCallToTransferChange } = useCallActions()
const { isActiveCallsPopupActive } = usePhoneState()

const callId = computed<string | undefined>(() => {
    return actionsPopupType.value?.callId
})

const { displayName } = useCallInfo(callId)

// close modal in case in call ended
watch(
    callsInActiveRoom,
    (newCalls) => {
        const { callId } = actionsPopupType.value || {}  // Destructure callId from actionsPopupType


        // Check if the selected call is still present in newCalls
        const isActionsSelectedCallStillPresent = newCalls.some(call => call._id === callId)

        // Handle the action toggle based on conditions
        if (
            (callId !== ActionsTriggerObjectType.multiple && !isActionsSelectedCallStillPresent) ||
            (callId === ActionsTriggerObjectType.multiple && !newCalls.length)
        ) {
            onActionsToggle(null)  // close actions popup
        }
    },
    { immediate: true }
)

/* Methods */
const handlePopupsClosing = (newCalls: { [key: string]: ICall}) => {
    const isTransferSelectedCallStillPresent = Object.values(newCalls).some(call => call._id === callToTransfer?.value)
    if(!isTransferSelectedCallStillPresent) {
        onCallToTransferChange(undefined)
    }
}
watch(
    activeCalls,
    (calls) => {
        handlePopupsClosing(calls)
    },
    {
        immediate: true,
        deep: true
    }
)


/* Computed */

const isOneActiveCallInActiveRoom = computed(() => {
    return callsInActiveRoom.value.length === 1
})
const isTwoAndMoreActiveCallsInActiveRoom = computed(() => {
    return callsInActiveRoom.value.length > 1
})
</script>
<style lang="scss" scoped>
</style>

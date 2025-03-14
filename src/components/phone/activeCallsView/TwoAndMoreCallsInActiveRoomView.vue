<template>
    <div class="flex-1 flex flex-col">
        <CallsCompactView
            v-if="roomsWithoutActive.length"
            :rooms-length="activeRoomsWithoutIncoming.length"
            :calls-length="lengthOfCallsWithoutIncoming"
        />
        <MultipleCallsActiveRoom
            :max-height="maxHeight"
        />
        <div
            class="keypad-wrapper gap-x-5 gap-y-8 px-1 w-full"
        >
            <CallActionButton
                v-for="(button, index) in controlButtonsConfig"
                :key="index"
                :disabled="button.disabled"
                :type="button.type"
                :src="button.src"
                :name="button.name"
                @click="button.action"
            />
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed, watch } from 'vue'
import { useVsipInject } from '@/composables/phone/useVsipProvideInject'
import CallsCompactView from '@/components/phone/common/CallsCompactView.vue'
import { KeyPadTriggerObjectType } from '@/constants/phone.ts'
import { usePhoneState } from '@/composables/phone/usePhoneState'
import { isMuted, useOpenSIPSJS } from '@/composables/opensipsjs'
import CallActionButton from '@/components/phone/activeCallsView/CallActionButton.vue'
import MultipleCallsActiveRoom from '@/components/phone/activeCallsView/MultipleCallsActiveRoom.vue'

/* Data */
const { onKeyPadToggle } = usePhoneState()
const { muteAgent, holdCall, unholdCall } = useOpenSIPSJS()

// const { isCallsMergeWarningEnabled } = useUserData()
// const { displayAllControls } = useCallActions()
const { roomsWithoutActive, callsInActiveRoom, lengthOfCallsWithoutIncoming, activeRoomsWithoutIncoming } = useVsipInject()

/* Methods */
const getControlButtonsConfig = () => {
    const baseConfig = [
        {
            type: 'blueButton',
            src: 'vc-lc-user-plus',
            name: 'add caller',
            action: () => onKeyPadToggle(KeyPadTriggerObjectType.add_caller)
        },
        {
            type: 'whiteButton',
            src: 'vc-lc-share-2',
            name: 'conference',
            disabled: isAllCallsUnHold.value,
            action: () => unHoldAllCalls()
        },
        {
            type: isMuted.value ? 'redButton-with-bg': 'whiteButton',
            src: isMuted.value ? 'vc-lc-mic-off' : 'vc-lc-mic',
            name: isMuted.value ? 'muted' : 'mute',
            action: () => muteAgent(!isMuted.value)
        },
        {
            type: isAllCallsOnHold.value ? 'redButton-with-bg': 'whiteButton',
            src: 'vc-lc-circle-pause',
            name: 'hold all',
            action: () => isAllCallsOnHold.value ? unHoldAllCalls() : holdAllCalls()
        },
        {
            type: 'blueButton',
            src: 'vc-lc-grip',
            name: 'keypad',
            action: () => onKeyPadToggle(KeyPadTriggerObjectType.keypad)
        },
    ]

    return baseConfig

    // if (isTwoCallsInActiveRoom.value) {
    //     // return [
    //     //     baseConfig[0],
    //     //     {
    //     //         type: 'whiteButton',
    //     //         src: 'vc-lc-merge',
    //     //         name: 'merge',
    //     //         action: () => onCallMergeModalHandle()
    //     //     },
    //     //     ...baseConfig.slice(1)
    //     // ]
    // }else if(!displayAllControls.value) {
    //     return [
    //         ...baseConfig.slice(2)
    //     ]
    // } else {
    //     return [
    //         ...baseConfig
    //     ]
    // }
}
//
// const onCallMergeModalHandle = () => {
//     if(!isCallsMergeWarningEnabled.value) {
//         onCallMergeModalTrigger(true)
//     }else {
//         if(!currentActiveRoomId.value) {
//             return
//         }
//         mergeCall(currentActiveRoomId.value)
//     }
//
// }

const unHoldAllCalls = () => {
    callsInActiveRoom.value.forEach((call) => {
        unholdCall(call._id)
    })
}
const holdAllCalls = () => {
    callsInActiveRoom.value.forEach((call) => {
        holdCall(call._id)
    })
}
/* Computed */
const isAllCallsOnHold = computed(() => {
    return callsInActiveRoom.value.every((call) => call._localHold)
})
const isAllCallsUnHold = computed(() => {
    return callsInActiveRoom.value.every((call) => !call._localHold)
})
const rowsQuantity = computed(() => {
    const callCount = callsInActiveRoom.value.length

    if (isSingleRoom.value) {
        if (callCount <= 5) {
            return 6  // Simple with controls
        } else {
            return 8  // Simple without controls
        }
    } else {
        if (callCount <= 4) {
            return 5  // Multiple with controls
        } else {
            return 7  // Multiple without controls
        }
    }
})

const isSingleRoom  = computed(() => {
    return activeRoomsWithoutIncoming.value.length === 1
})

const isTwoCallsInActiveRoom  = computed(() => {
    return callsInActiveRoom.value.length === 2
})

//  merge button added and new call button removed when calls quantity equal 2
const controlButtonsConfig = computed(() => getControlButtonsConfig())

const maxHeight  = computed(() => {
    return rowsQuantity.value * 52
})
</script>
<style scoped lang="scss">
.keypad-wrapper {
  margin: auto;
}
</style>

<template>
    <div class="back-current-call-button flex items-center justify-between py-1">
        <BackButton @click="returnToActiveCall" />
        <div class="flex items-center truncate">
            <!--            <AudioQualityIndicator-->
            <!--                :call-id="firstCallInActiveRoomId"-->
            <!--            />-->
            <div class="duration mr-1">
                {{ activeRoomDuration }}
            </div>
            <div class="caller text-xs truncate">
                {{ activeRoomTitle }}
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
// import AudioQualityIndicator from '@/ui/phoneDialer/components/webRtcPhone/dialPad/mainBlock/AudioQualityIndicator.vue'
import { usePhoneState } from '@/composables/phone/usePhoneState.ts'
import { useVsipInject } from '@/composables/phone/useVsipProvideInject.ts'
import BackButton from '@/components/phone/activeCallsWithKeypadView/BackButton.vue'
import { useRoomData } from '@/composables/phone/useRoomData.ts'

const { callsInActiveRoom   } = useVsipInject()
const { onKeyPadToggle } = usePhoneState()
const { getRoomTitle, getDuration } = useRoomData()

const activeRoomTitle = computed(() => {
    return getRoomTitle(callsInActiveRoom.value)
})
const activeRoomDuration = computed(() => {
    return getDuration(callsInActiveRoom.value)
})

// const firstCallInActiveRoomId = computed(() => {
//     return callsInActiveRoom.value[0]?._id
// })

/* Methods */
const returnToActiveCall = () => {
    onKeyPadToggle(undefined)
}



</script>
<style lang="scss" scoped>
.back-current-call-button {
  .duration {
    color: var(--inactive-text);
    font-size: 10px;
    font-style: normal;
    min-width: 50px;
    font-weight: 550;
    line-height: normal;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }

  .caller {
    font-weight: 680;
    line-height: 150%;
    letter-spacing: 0.72px;
    text-transform: uppercase;
    color: var(--default-text)
  }
}
</style>

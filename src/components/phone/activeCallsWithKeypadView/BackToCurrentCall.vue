<template>
    <div
        ref="backToCurrentCallRef"
        class="back-current-call-button flex items-center justify-between"
        :class="[isXsLayout ? 'py-0 is-xs' : 'py-1']"
    >
        <BackButton @click="returnToActiveCall" />

        <div class="flex items-center truncate">
            <!--            <AudioQualityIndicator-->
            <!--                :call-id="firstCallInActiveRoomId"-->
            <!--            />-->
            <div class="duration mr-1">
                {{ roomDuration }}
            </div>
            <div class="caller text-xs truncate">
                {{ roomTitle }}
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
// import AudioQualityIndicator from '@/ui/phoneDialer/components/webRtcPhone/dialPad/mainBlock/AudioQualityIndicator.vue'
import { ref } from 'vue'
import { usePhoneState } from '@/composables/phone/usePhoneState.ts'
import BackButton from '@/components/phone/activeCallsWithKeypadView/BackButton.vue'
import { useMainWrapperHeight } from '@/composables/phone/useMainWrapperHeight'
import { useRoomData } from '@/composables/phone/useRoomData.ts'

/* Props */
const props = defineProps<{
    roomId: number
}>()

const { onKeyPadToggle } = usePhoneState()
const { roomTitle, roomDuration } = useRoomData(props.roomId)

const backToCurrentCallRef = ref<HTMLElement | null>(null)
const { isXsLayout } = useMainWrapperHeight(backToCurrentCallRef)

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

  &.is-xs {
    .duration {
      font-size: 9px;
      min-width: 42px;
    }
    .caller {
      font-size: 10px;
      letter-spacing: 0.4px;
    }
  }
}
</style>

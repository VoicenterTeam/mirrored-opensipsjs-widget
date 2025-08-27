<template>
    <div class="active-call-popup-row-wrapper p-2 flex justify-between items-center gap-x-2">
        <div class="call-data truncate">
            <div class="caller text-sm font-semibold truncate">
                {{ roomTitle }}
            </div>
            <div class="flex items-center">
                <!--                <AudioQualityIndicator-->
                <!--                    class="mr-1"-->
                <!--                    :call-id="callId"-->
                <!--                />-->
                <div class="duration text-xs font-medium">
                    {{ roomDuration }}
                </div>
            </div>
        </div>
        <div class="actions flex items-center gap-x-1">
            <button
                class="set-active-room-button button rounded-full flex justify-center items-center"
                @click="changeActiveRoom"
            >
                <i class="vc-lc-log-in" />
            </button>
            <HangupButton
                size="small"
                @click="onCallEnd"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
// import AudioQualityIndicator from '@/ui/phoneDialer/components/webRtcPhone/dialPad/mainBlock/AudioQualityIndicator.vue'
import HangupButton from '@/components/phone/common/HangupButton.vue'
import { usePhoneState } from '@/composables/phone/usePhoneState.ts'
import { useOpenSIPSJS } from '@/composables/opensipsjs.ts'
import { useRoomData } from '@/composables/phone/useRoomData.ts'

/* Props */
type Props = {
    roomId: number,
}
const props = defineProps<Props>()

/* Composable */
const { onActiveCallsPopupToggle, onKeyPadToggle } = usePhoneState()
const { terminateCall, setActiveRoom, getActiveCallsInRoom } = useOpenSIPSJS()
const { roomTitle, roomDuration } = useRoomData(props.roomId)

/* Methods */
const onCallEnd = () => {
    const calls = getActiveCallsInRoom(props.roomId)

    calls.forEach(call => terminateCall(call._id))
}

const changeActiveRoom = async () => {
    await setActiveRoom(props.roomId)
    onActiveCallsPopupToggle(false)

    // TODO discuss correct behaviour when design is done
    onKeyPadToggle(undefined)
}
</script>
<style lang="scss">
.active-call-popup-row-wrapper {
  .call-data {
    .duration {
      letter-spacing: -0.12px;
      color: var(--inactive-text);
    }
    .caller {
      color: var(--default-text);
    }
  }

  .actions {
    .set-active-room-button {
      @apply h-8 w-8;
      background-color: color-mix(in srgb, var(--secondary) 10%, transparent);
      i {
        color: var(--primary);
      }
    }
  }
}
</style>

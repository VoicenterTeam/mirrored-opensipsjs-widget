<template>
    <div class="call-move-popup-wrapper absolute w-full phone-dialer-custom-scroll">
        <PopupHeader
            :action="closeMoveCallPopup"
        >
            <div class="truncate">
                <div class="header font-bold text-base truncate">
                    {{ displayName }}
                </div>
                <div class="move-subheader font-semibold">
                    {{ getTranslation('audio.choose.active.call.to.move') }}
                </div>
            </div>
        </PopupHeader>
        <div
            :class="{'mb-12': roomsWithoutActive.length === 1}"
            class="not-active-calls-wrapper mb-4 overflow-auto"
        >
            <CallMovePopupRow
                v-for="room in roomsWithoutActive"
                :key="room.roomId"
                :room-id="room.roomId"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import PopupHeader from '@/components/phone/common/PopupHeader.vue'
import useCallActions from '@/composables/phone/useCallActions.ts'
import { roomsWithoutActive } from '@/composables/opensipsjs.ts'
import CallMovePopupRow from '@/components/phone/activeCallsView/CallMovePopupRow.vue'
import { getTranslation } from '@/plugins/translator'
import useCallInfo from '@/composables/useCallInfo.ts'
// import CallMovePopupRow from '@/ui/phoneDialer/components/webRtcPhone/dialPad/Actions/Move/CallMovePopupRow.vue'

/* Data */
const { onCallToMoveChange, callToMove } = useCallActions()
const { displayName } = useCallInfo(callToMove)

/* Methods */
const closeMoveCallPopup = () => {
    onCallToMoveChange(undefined)
}
</script>
<style lang="scss" scoped>
.call-move-popup-wrapper {
  bottom: 0;
  background-color: var(--main-bg);
  border-radius: 22px 22px 0px 0px;
  box-shadow: 0px -2px 20px 0px var(--card-shadow-color);

  .move-subheader {
    color: var(--secondary);
    font-size: 11px;
    letter-spacing: 0.77px;
    text-transform: uppercase;
  }

  .not-active-calls-wrapper {
    max-height: 410px;
    .actions {
      .call-end-button {
        height: 32px;
        width: 32px;
        i {
          font-size: 1.5rem;
        }
      }
    }
  }
}
</style>

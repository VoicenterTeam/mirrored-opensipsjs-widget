<template>
    <div class="active-calls-popup-wrapper absolute w-full phone-dialer-custom-scroll">
        <PopupHeader
            header="Active calls"
            :action="closeCallsPopup"
        />
        <div
            v-if="currentActiveRoom"
            class="current-call-block pt-3 pb-4 px-4"
        >
            <div class="title font-semibold pb-2">
                {{ getTranslation('audio.current.call') }}
            </div>
            <ActiveCallPopupRow
                class="data"
                current-room
                :caller="activeRoomTitle"
                :room-id="currentActiveRoom"
                :call-id="firstCallInActiveRoomId"
                :duration="activeRoomDuration"
            />
        </div>
        <div
            v-if="isMergeButtonVisible || isConferenceButtonVisible"
            class="calls-manage-buttons-block  flex items-center justify-between p-4 gap-x-1"
        >
            <button
                v-if="isMergeButtonVisible"
                class="merge h-8 flex items-center justify-center gap-x-1"
                @click="handleCallsMerge"
            >
                <i class="vc-lc-merge text-base" />
                <div>{{ getTranslation('audio.merge.all') }}</div>
            </button>
            <button
                v-if="isConferenceButtonVisible"
                class="conference merge h-8 flex items-center justify-center gap-x-1"
                @click="handleCallsConference"
            >
                <i class="vc-lc-share-2 text-base" />
                <div>{{ getTranslation('audio.conference.all') }}</div>
            </button>
        </div>
        <div
            :class="{'mb-12': roomsWithoutActive.length === 1}"
            class="not-active-calls-wrapper mb-4 overflow-auto"
        >
            <ActiveCallPopupRow
                v-for="room in roomsWithoutActive"
                :key="room.roomId"
                :room-id="room.roomId"
                :call-id="getFirstCallIdInRoom(room.roomId)"
                :caller="getCaller(room.roomId)"
                :duration="getRoomDuration(room.roomId)"
            />
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed, onBeforeUnmount } from 'vue'
import { useRoomData } from '@/composables/phone/useRoomData.ts'
import PopupHeader from '@/components/phone/common/PopupHeader.vue'
import ActiveCallPopupRow from '@/components/phone/common/ActiveCallPopupRow.vue'
import { useVsipInject } from '@/composables/phone/useVsipProvideInject.ts'
import { usePhoneState } from '@/composables/phone/usePhoneState.ts'
import { currentActiveRoom, allRooms, activeCalls, useOpenSIPSJS } from '@/composables/opensipsjs'
import { getTranslation } from '@/plugins/translator'

/* Data */
const { callsInActiveRoom, roomsWithoutActive, getActiveCallsInRoom } = useVsipInject()
const { onActiveCallsPopupToggle } = usePhoneState()
const { moveCall, mergeCallByIds } = useOpenSIPSJS()
const { getRoomTitle, getDuration, getFirstCallIdInRoom, getCaller, getRoomDuration } = useRoomData()

/* Computed */
const firstCallInActiveRoomId = computed(() => {
    return callsInActiveRoom.value[0]?._id
})

const activeRoomTitle = computed(() => {
    return getRoomTitle(callsInActiveRoom.value)
})
const activeRoomDuration = computed(() => {
    return getDuration(callsInActiveRoom.value)
})

const closeCallsPopup = ()  => {
    onActiveCallsPopupToggle(false)
}

const isConferenceButtonVisible = computed(() => {
    return Object.keys(allRooms.value).length > 1
})

const isMergeButtonVisible = computed(() => {
    const rooms = Object.values(allRooms.value)

    if (rooms.length !== 2) return false

    const [ room1, room2 ] = rooms

    return [ room1, room2 ].every(room => getActiveCallsInRoom(room.roomId).length === 1)
})

/* Methods */
const handleCallsMerge = () => {
    const ids = Object.keys(activeCalls.value)

    const [ callId1, callId2 ] = ids

    mergeCallByIds(callId1, callId2)
}
const handleCallsConference = () => {
    const [ room ] = Object.values(allRooms.value)

    if (room) {
        Object.values(activeCalls.value).forEach(call => moveCall(call._id, room.roomId))
    }
}

/* OnBeforeUnmount */
onBeforeUnmount(() => {
    onActiveCallsPopupToggle(false)
})
</script>
<style lang="scss">
.active-calls-popup-wrapper {
  bottom: 0;
  background-color: var(--light-bg);
  border-radius: 22px 22px 0px 0px;
  box-shadow: 0px -2px 20px 0px var(--card-shadow-color);
  .current-call-block {
    border-bottom: 0.5px solid var(--ui-lines);
    .title {
      color: var(--secondary);
      font-size: 10px;
      letter-spacing: 0.8px;
      text-transform: uppercase;
    }
    .data {
      border-radius: 152px;
      background-color:
          color-mix(in srgb, var(--secondary) var(--dynamic-percentage-10), transparent);
      .actions {
        .call-end-button {
          height: 26px;
          width: 26px;

          i {
            font-size: 1rem;
          }
        }
      }
    }
  }
  .calls-manage-buttons-block {
    border-bottom: 0.5px solid var(--ui-lines);
    .merge, .conference {
      @apply text-xs text-active-elements;
      border-radius: 100px;
      background-color:
          color-mix(in srgb, var(--secondary) var(--dynamic-percentage-5), transparent);
      font-weight: 550;
      flex: 1 0 50%;


      &:hover, :focus {
        background-color:
            color-mix(in srgb, var(--secondary-actions) var(--dynamic-percentage-5-hover), transparent);
      }
      i {
        color: var(--active-elements);
      }
    }
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

    .active-call-popup-row-wrapper {
      border-bottom: 0.5px solid var(--ui-lines);
    }
  }
}
</style>

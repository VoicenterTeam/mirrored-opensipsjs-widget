<template>
    <div
        ref="activeCallsPopupRef"
        class="active-calls-popup-wrapper absolute w-full phone-dialer-custom-scroll"
        :class="{ 'is-xs': isXsLayout }"
    >
        <PopupHeader
            :header="getTranslation('common.active.calls')"
            :action="closeCallsPopup"
        />
        <div
            v-if="currentActiveRoom"
            class="current-call-block px-4"
            :class="isXsLayout ? 'pt-1 pb-1' : 'pt-3 pb-4'"
        >
            <div
                class="title font-semibold"
                :class="isXsLayout ? 'pb-0' : 'pb-2'"
            >
                {{ getTranslation('audio.current.call') }}
            </div>
            <ActiveCallPopupRow
                class="data"
                current-room
                :room-id="currentActiveRoom"
            />
        </div>
        <div
            v-if="isMergeButtonVisible || isConferenceButtonVisible"
            class="calls-manage-buttons-block  flex items-center justify-between gap-x-1"
            :class="isXsLayout ? 'px-2 py-1' : 'p-4'"
        >
            <button
                v-if="isMergeButtonVisible"
                class="merge flex items-center justify-center gap-x-1"
                :class="isXsLayout ? 'h-6' : 'h-8'"
                @click="handleCallsMerge"
            >
                <i class="vc-lc-merge text-base" />
                <div>{{ getTranslation('audio.merge.all') }}</div>
            </button>
            <button
                v-if="isConferenceButtonVisible"
                class="conference merge flex items-center justify-center gap-x-1"
                :class="isXsLayout ? 'h-6' : 'h-8'"
                @click="handleCallsConference"
            >
                <i class="vc-lc-share-2 text-base" />
                <div>{{ getTranslation('audio.conference.all') }}</div>
            </button>
        </div>
        <div
            :class="[
                { 'mb-12': roomsWithoutActive.length === 1 && !isXsLayout },
                isXsLayout ? 'mb-1' : 'mb-4',
            ]"
            class="not-active-calls-wrapper overflow-auto"
        >
            <ActiveCallPopupRow
                v-for="room in roomsWithoutActive"
                :key="room.roomId"
                :room-id="room.roomId"
            />
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import PopupHeader from '@/components/phone/common/PopupHeader.vue'
import ActiveCallPopupRow from '@/components/phone/common/ActiveCallPopupRow.vue'
import { usePhoneState } from '@/composables/phone/usePhoneState.ts'
import { useOpenSIPSJS } from '@/composables/opensipsjs'
import { useMainWrapperHeight } from '@/composables/phone/useMainWrapperHeight'
import { getTranslation } from '@/plugins/translator'

/* Data */
const { onActiveCallsPopupToggle } = usePhoneState()
const { getAudioState, getAudioApi } = useOpenSIPSJS()
const { currentActiveRoom, allRooms, activeCalls, roomsWithoutActive } = getAudioState()
const { moveCall, mergeCallByIds, getActiveCallsInRoom } = getAudioApi()

const activeCallsPopupRef = ref<HTMLElement | null>(null)
const { isXsLayout } = useMainWrapperHeight(activeCallsPopupRef)

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

  &.is-xs {
    border-radius: 14px 14px 0 0;

    .popup-header-container {
      height: 32px;
      padding: 4px 12px;
      .header {
        font-size: 13px;
      }
      .close-button {
        padding: 2px;
      }
    }

    .current-call-block .title {
      font-size: 9px;
      letter-spacing: 0.5px;
    }

    .calls-manage-buttons-block .merge,
    .calls-manage-buttons-block .conference {
      font-size: 10px;
      i {
        font-size: 12px;
      }
    }

    .not-active-calls-wrapper {
      max-height: 120px;
      .active-call-popup-row-wrapper {
        padding: 4px 8px;
        .call-data .caller {
          font-size: 12px;
        }
        .call-data .duration {
          font-size: 10px;
        }
      }
      .actions .set-active-room-button {
        height: 24px;
        width: 24px;
        i {
          font-size: 12px;
        }
      }
      .actions .call-end-button {
        height: 24px;
        width: 24px;
        i {
          font-size: 14px;
        }
      }
    }
  }
}
</style>

<template>
    <div class="active-call-row-wrapper p-2 flex items-center">
        <div
            class="volume-wrapper mr-2 flex justify-center items-center"
            :class="{'h-4': !isCallOnHold }"
        >
            <div
                v-if="isCallOnHold"
                class="unhold-icon-wrapper flex justify-center items-center"
            >
                <i class="vc-lc-circle-pause" />
            </div>

            <VolumeLevelIndicator
                v-else-if="audioTag"
                :device-id="callId"
                :stream="audioTag.srcObject"
            />
        </div>
        <div class="flex-1 grow call-data-wrapper truncate mr-1">
            <div class="caller font-semibold truncate">
                {{ displayName }}
            </div>
            <div class="flex items-center gap-x-1">
                <HoldTimer
                    v-if="isCallOnHold && call.putOnHoldTimestamp"
                    :put-on-hold-timestamp="call.putOnHoldTimestamp"
                />
                <!--                <AudioQualityIndicator-->
                <!--                    :call-id="callId"-->
                <!--                />-->
                <div class="call-duration font-medium">
                    {{ duration }}
                </div>
            </div>
        </div>
        <div class="buttons-wrapper flex items-center gap-x-1">
            <div class="hold-buttons-wrapper">
                <button
                    v-if="isCallOnHold"
                    class="unhold-button button rounded-full flex justify-center items-center"
                    @click="onCallUnHold"
                >
                    <i class="vc-lc-circle-pause" />
                </button>
                <button
                    v-else
                    class="hold-button button rounded-full flex justify-center items-center"
                    @click="onCallHold"
                >
                    <i class="vc-lc-circle-pause" />
                </button>
            </div>
            <button
                :class="{'active': active }"
                class="actions-button button rounded-full flex justify-center items-center"
                @click="onActionsClick"
            >
                <i class="vc-icon-menu" />
            </button>
            <button
                :class="{'active': active }"
                class="hangup-button button rounded-full flex justify-center items-center"
                @click="onCallEnd"
            >
                <i class="vc-icon-phone-down" />
            </button>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
// import AudioQualityIndicator from '@/ui/phoneDialer/components/webRtcPhone/dialPad/mainBlock/AudioQualityIndicator.vue'
import VolumeLevelIndicator from '@/components/phone/common/VolumeLevelIndicator.vue'
import { ActionsTriggerObjectType } from '@/constants/phone.ts'
import type { ICall } from 'opensips-js/src/types/rtc'
import useCallActions from '@/composables/phone/useCallActions.ts'
import HoldTimer from '@/components/phone/common/HoldTimer.vue'
import { useOpenSIPSJS } from '@/composables/opensipsjs.ts'
import useCallInfo from '@/composables/useCallInfo.ts'

/* Props */
type Props = {
    duration: string,
    callId: string,
    call: ICall
    // TODO fix any
    audioTag: any
}
const props = defineProps<Props>()

/* Composable */
const { displayName } = useCallInfo(props.call)
const { onActionsToggle, actionsPopupType } = useCallActions()
const { getAudioApi } = useOpenSIPSJS()

const { holdCall, unholdCall, terminateCall } = getAudioApi()

/* Computed */
const active = computed(() => {
    return props.callId === actionsPopupType.value?.callId
})
const isCallOnHold = computed(() => {
    return props.call._localHold
})

/* Methods */
const onCallEnd = () => {
    terminateCall(props.callId)
}
const onActionsClick = () => {
    onActionsToggle({
        initiator: ActionsTriggerObjectType.separate,
        callId: props.callId
    })
}
const onCallHold = () => {
    holdCall(props.callId)
}
const onCallUnHold = () => {
    unholdCall(props.callId)
}

</script>
<style lang="scss">
.active-call-row-wrapper {
  height: 3.25rem;
  max-height: 3.25rem;

  .buttons-wrapper {
    flex:0 0 auto;
  }
  .volume-wrapper {
    flex:0 0 1.5rem;

    .unhold-icon-wrapper {
      i {
        @apply text-secondary;
      }
    }
  }
  .button {
    height: 30px;
    width: 30px;
    flex-shrink: 0;
  }
  .actions-button, .hold-button {
    background-color: color-mix(in srgb, var(--secondary) var(--dynamic-percentage-5), transparent);
    i {
      color: var(--active-elements)
    }
    &:hover {
      background-color:
          color-mix(in srgb, var(--secondary-actions) var(--dynamic-percentage-5-hover), transparent);
    }
  }
  .actions-button {
    &.active {
      background-color: var(--active-elements);

      i {
        color: var(--btn-filled-text)
      }
    }
  }
  .unhold-button {
    background-color: color-mix(in srgb, var(--destructive-actions) var(--dynamic-percentage-5), transparent);
    &:hover,
    &:focus {
      background-color:
          color-mix(in srgb, var(--destructive-actions--focus) var(--dynamic-percentage-5-hover), transparent);
    }
    &:active {
      background-color:
          color-mix(in srgb, var(--destructive-actions--pressed) var(--dynamic-percentage-5-hover), transparent);
    }

    i {
      @apply text-destructive;
    }
  }

  .hangup-button {
    @apply bg-destructive-actions border-destructive-actions;
    &:hover,
    &:focus {
      @apply bg-destructive-actions--focus border-destructive-actions--focus text-btn-filled-text;
    }
    &:active {
      @apply bg-destructive-actions--pressed border-destructive-actions--pressed text-btn-filled-text;
    }
    i {
      @apply text-white;
      font-size: 1.5rem;
    }
  }
  .call-data-wrapper {
    .caller {
      font-size: 13px;
      color: var(--default-text)
    }
    .call-duration {
      color: var(--inactive-text);
      font-size: 10px;
      line-height: normal;
    }
    .hold-duration-wrapper {
      border-radius: 100px;
      background-color: color-mix(in srgb, var(--secondary) 20%, transparent);
      .hold-duration {
        font-size: 10px;
        line-height: normal;
      }
    }
  }
}
</style>

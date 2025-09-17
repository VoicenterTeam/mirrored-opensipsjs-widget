<template>
    <div class="wrapper p-2 flex justify-between items-center">
        <div class="data w-4/5">
            <div class="caller text-sm font-bold truncate">
                {{ roomTitle }}
            </div>
            <div class="flex items-center">
                <!--                <AudioQualityIndicator-->
                <!--                    class="mr-1"-->
                <!--                    :call-id="callId"-->
                <!--                />-->
                <div class="duration text-sm font-medium">
                    {{ roomDuration }}
                </div>
            </div>
        </div>
        <button
            class="actions-button button rounded-full flex justify-center items-center"
            @click="onCallMove"
        >
            <i class="vc-lc-git-pull-request-arrow" />
        </button>
    </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount } from 'vue'
import { useOpenSIPSJS } from '@/composables/opensipsjs'
import useCallActions from '@/composables/phone/useCallActions.ts'
import { useRoomData } from '@/composables/phone/useRoomData.ts'

/* Props */
type Props = {
    roomId: number
}
const props = defineProps<Props>()

/* Computed */
const { getAudioApi } = useOpenSIPSJS()
const { moveCall } = getAudioApi()
const { callToMove, onCallToMoveChange } = useCallActions()
const { roomTitle, roomDuration } = useRoomData(props.roomId)

/* Methods */
const onCallMove = () => {
    if(callToMove.value && props.roomId) {
        moveCall(callToMove.value, props.roomId)
    }
    onCallToMoveChange(undefined)
}

/* OnBeforeUnmount */
onBeforeUnmount(() => {
    onCallToMoveChange(undefined)
})
</script>
<style lang="scss">
.wrapper {
  border-bottom: 0.5px solid var(--ui-lines);
  .data {
    .duration {
      color: var(--inactive-text-grey);
    }
    .caller {
      color: var(--default-text)
    }
  }
  .actions-button {
    @apply h-8 w-8 bg-primary;

    i {
      color: var(--white);
    }
    &:hover, :focus {
      background-color: var(--primary-actions--focus);
    }
  }
}
</style>

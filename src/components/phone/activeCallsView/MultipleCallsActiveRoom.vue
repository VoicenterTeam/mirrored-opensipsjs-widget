<template>
    <div
        ref="activeCallsWrapperRef"
        class="active-calls-wrapper mb-2"
        :class="{ 'is-xs': isXsLayout }"
        :style="{ maxHeight: `${dynamicMaxHeight}px` }"
    >
        <div
            class="header uppercase font-semibold overflow-hidden"
            :class="isXsLayout ? 'px-2 py-1 h-6' : 'p-2 h-8'"
        >
            {{ getTranslation('audio.participants') }}
        </div>
        <div
            class="rows-wrapper overflow-auto phone-dialer-custom-scroll"
            :style="{ maxHeight: maxHeight + 'px' }"
        >
            <ActiveCallRow
                v-for="call in callsInActiveRoom"
                :key="call._id"
                :call-id="call._id"
                :call="call"
                :audio-tag="call.audioTag"
                :duration="getDuration(call._id)"
            />
        </div>
    </div>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue'
import ActiveCallRow from './ActiveCallRow.vue'
import { useOpenSIPSJS } from '@/composables/opensipsjs'
import { useMainWrapperHeight } from '@/composables/phone/useMainWrapperHeight'
import { getTranslation } from '@/plugins/translator'

const { getAudioState } = useOpenSIPSJS()
const { callTime, callsInActiveRoom, activeRoomsWithoutIncoming } = getAudioState()

interface Props {
    maxHeight: number,
}
defineProps<Props>()

const XS_MAX_HEIGHT_SINGLE_ROOM = 85
const XS_MAX_HEIGHT_MULTI_ROOM = 60
const COMPACT_MAX_HEIGHT_SINGLE_ROOM = 125
const COMPACT_MAX_HEIGHT_MULTI_ROOM = 90
const MEDIUM_MAX_HEIGHT = 150
const MEDIUM_THRESHOLD_HEIGHT = 600
const FALLBACK_MAX_HEIGHT = 250

const activeCallsWrapperRef = ref<HTMLElement | null>(null)
const { mainWrapperHeight, isCompactLayout, isXsLayout } = useMainWrapperHeight(activeCallsWrapperRef)

const isMultiRoom = computed(() => activeRoomsWithoutIncoming.value.length > 1)

const dynamicMaxHeight = computed(() => {
    if (isXsLayout.value) {
        return isMultiRoom.value ? XS_MAX_HEIGHT_MULTI_ROOM : XS_MAX_HEIGHT_SINGLE_ROOM
    }

    if (isCompactLayout.value) {
        return isMultiRoom.value ? COMPACT_MAX_HEIGHT_MULTI_ROOM : COMPACT_MAX_HEIGHT_SINGLE_ROOM
    }

    if (mainWrapperHeight.value <= MEDIUM_THRESHOLD_HEIGHT) {
        return MEDIUM_MAX_HEIGHT
    }

    return FALLBACK_MAX_HEIGHT
})

const getDuration = (callId: string) => {
    return callTime.value?.[callId]?.formatted || ''
}
</script>
<style lang="scss" scoped>
.active-calls-wrapper {
  border-radius: 10px;
  border: 1px solid var(--ui-lines);
  overflow-y: auto;
  .header {
    font-size: 11px;
    color: var(--secondary);
    border-bottom: 1px solid var(--ui-lines);
  }
  .rows-wrapper {
    .active-call-row-wrapper:not(:last-child) {
      border-bottom: 1px solid var(--ui-lines);
    }
  }

  &.is-xs {
    .header {
      font-size: 9px;
      line-height: 1;
    }
  }
}
</style>

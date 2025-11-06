<template>
    <div class="active-calls-wrapper mb-2">
        <div class="header p-2 uppercase font-semibold overflow-hidden h-8">
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
import ActiveCallRow from './ActiveCallRow.vue'
import { useOpenSIPSJS } from '@/composables/opensipsjs'
import { getTranslation } from '@/plugins/translator'

const { getAudioState } = useOpenSIPSJS()
const { callTime, callsInActiveRoom } = getAudioState()

interface Props {
    maxHeight: number,
}
defineProps<Props>()

const getDuration = (callId: string) => {
    return callTime.value?.[callId]?.formatted || ''
}
</script>
<style lang="scss" scoped>
.active-calls-wrapper {
  border-radius: 10px;
  border: 1px solid var(--ui-lines);
  max-height: 350px;
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
}
</style>

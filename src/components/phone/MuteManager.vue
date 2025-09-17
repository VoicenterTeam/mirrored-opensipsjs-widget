<template>
    <div class="flex items-center sensitivity-block gap-x-1">
        <div
            class="h-5 w-5 flex justify-center items-center rounded-sm cursor-pointer"
            :class="{
                'vc-lc-mic-off': muted,
                'vc-lc-mic': !muted,
                'active': muted
            }"
            :style="{ color: muted ? 'var(--destructive)' : 'var(--primary)' }"
            @click="toggleMute"
        />

        <VolumeIndicator
            :stream="originalStream"
            :bar-height="7"
            :bar-width="250"
            :sensitivity="2"
        />
    </div>
</template>
<script setup lang="ts">
import VolumeIndicator from '@/components/phone/VolumeIndicator.vue'
import { useOpenSIPSJS } from '@/composables/opensipsjs'

/* Data */
const { getAudioApi, getAudioState  } = useOpenSIPSJS()
const { muted, originalStream } = getAudioState()
const { mute } = getAudioApi()

/* Methods */
const toggleMute = () => {
    mute(!muted.value)
}
</script>
<style lang="scss" scoped>
.sensitivity-block {
  overflow: hidden;
  text-overflow: ellipsis;
  .active {
    background-color:
        color-mix(in srgb, var(--destructive) var(--dynamic-percentage-10), transparent);
  }
}

</style>

<template>
    <div class="flex items-center sensitivity-block gap-x-1">
        <div
            class="h-5 w-5 flex justify-center items-center rounded-sm cursor-pointer"
            :class="{
                'vc-lc-mic-off': isMuted,
                'vc-lc-mic': !isMuted,
                'active': isMuted
            }"
            :style="{ color: isMuted ? 'var(--destructive)' : 'var(--primary)' }"
            @click="toggleMute"
        />

        <VolumeIndicator
            :stream="originalStream"
            :bar-height="7"
            :bar-width="125"
            :sensitivity="2"
        />
    </div>
</template>
<script setup lang="ts">
import VolumeIndicator from '@/components/phone/VolumeIndicator.vue'
import { isMuted, originalStream, useOpenSIPSJS } from '@/composables/opensipsjs'


/* Data */
const { muteAgent  } = useOpenSIPSJS()

/* Methods */
const toggleMute = () => {
    muteAgent(!isMuted)
}
</script>
<style lang="scss" scoped>
.sensitivity-block {
  flex: 1;
  .active {
    background-color:
        color-mix(in srgb, var(--destructive) var(--dynamic-percentage-10), transparent);
  }
}

</style>
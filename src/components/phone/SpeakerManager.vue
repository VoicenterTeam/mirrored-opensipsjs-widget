<template>
    <div class="flex gap-x-1 items-center volume-block">
        <div
            class="h-5 w-5 flex justify-center items-center rounded-sm"
            :class="{'active': isSpeakerMuted || !speakerPlayerVolume }"
        >
            <i
                :class="{
                    'cursor-pointer text-base vc-lc-volume-x': isSpeakerMuted || !speakerPlayerVolume,
                    'vc-lc-volume-1 cursor-pointer text-base': !isSpeakerMuted && speakerPlayerVolume
                }"
                :style="{ color: isSpeakerMuted || !speakerPlayerVolume ? 'var(--destructive)' : 'var(--primary)' }"
                @click="toggleMute"
            />
        </div>
        <!--        <RangeSlider-->
        <!--            v-model="speakerPlayerVolume"-->
        <!--            class="volume-slider"-->
        <!--        />-->
    </div>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue'
//import RangeSlider from '@/components/phone/RangeSlider.vue'
import { speakerVolume, useOpenSIPSJS, } from '@/composables/opensipsjs'

/* Data */
const speakerPlayerVolume = ref(speakerVolume.value * 100)
const isSpeakerMuted = ref(false)
const { setSpeakerVolume  } = useOpenSIPSJS()
/* Watchers */
watch(
    speakerPlayerVolume,
    (val) => {
        isSpeakerMuted.value = false
        setSpeakerVolume(val/100)
    }
)

/* Methods */
const onSpeakerMute = () => {
    isSpeakerMuted.value = true
    setSpeakerVolume(0)
}

const onSpeakerUnmute = () => {
    isSpeakerMuted.value = false
    setSpeakerVolume(speakerPlayerVolume.value/100)
}

const toggleMute = () => {
    if (isSpeakerMuted.value || !speakerPlayerVolume.value) {
        onSpeakerUnmute()
    } else {
        onSpeakerMute()
    }
}
</script>
<style lang="scss" scoped>
.volume-block {
  .volume-slider {
    flex:1;
    :deep() {
      .vue-slider {
        height: 2px !important;
        .vue-slider-process {
         // @apply bg-blue-icon #{!important};
        }
      }
    }
  }
}
.volume-block, .sensitivity-block {
  flex: 1;
  .active {
    background-color:
        color-mix(in srgb, var(--destructive) var(--dynamic-percentage-10), transparent);
  }
}

</style>
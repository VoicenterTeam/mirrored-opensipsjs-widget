<template>
    <div
        class="
          flex
          gap-x-1
          items-center
          min-w-0
          volume-block
        "
    >
        <div
            v-if="isSpeakerMuted||!speakerPlayerVolume"
            class="h-5 w-5 shrink-0 flex justify-center items-center active rounded-sm"
        >
            <i
                class="cursor-pointer text-base vc-lc-volume-x"
                :style="{ color: 'var(--destructive)' }"
                @click="onSpeakerUnmute"
            />
        </div>
        <div
            v-else
            class="h-5 w-5 shrink-0 flex justify-center items-center rounded-sm"
        >
            <i
                class="vc-lc-volume-1 cursor-pointer text-base"
                :style="{ color: 'var(--primary)' }"
                @click="onSpeakerMute"
            />
        </div>
        <VcSlider
            v-model="speakerPlayerVolume"
            :show-tooltip="false"
            placement="left"
            class="slider flex-1 basis-0 min-w-0 w-full"
        />
    </div>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useOpenSIPSJS } from '@/composables/opensipsjs'

const { getAudioApi, getAudioState  } = useOpenSIPSJS()
const { speakerVolume } = getAudioState()
const { setSpeakerVolume } = getAudioApi()

/* Data */
const speakerPlayerVolume = ref(speakerVolume.value * 100)
const isSpeakerMuted = ref(false)

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

</script>
<style lang="scss" scoped>
.volume-block {
  min-width: 0;

  .slider {
    flex: 1 1 0;
    min-width: 0;
    width: 100%;
  }

  .active {
    background-color:
        color-mix(in srgb, var(--destructive) var(--dynamic-percentage-10), transparent);
  }
}
</style>
<style lang="scss">
.el-slider {
  max-width: 250px;
  min-width: 0;
  width: 100%;

  .el-slider__runway, .el-slider__bar  {
    height: 2px;
  }


  .el-slider__runway {
    .el-slider__button-wrapper {
      height: auto;
      width: auto;
      top: -10px;
      .el-slider__button {
        height: 15px;
        width: 15px;
      }
    }


  }
}

</style>

<template>
    <div
        class="
          flex
          gap-x-1
          items-center
          volume-block
        "
    >
        <div
            v-if="isSpeakerMuted||!speakerPlayerVolume"
            class="h-5 w-5 flex justify-center items-center active rounded-sm"
        >
            <i
                class="cursor-pointer text-base vc-lc-volume-x"
                :style="{ color: 'var(--destructive)' }"
                @click="onSpeakerUnmute"
            />
        </div>
        <div
            v-else
            class="h-5 w-5 flex justify-center items-center rounded-sm"
        >
            <i
                class="vc-lc-volume-1 cursor-pointer text-base"
                :style="{ color: 'var(--primary)' }"
                @click="onSpeakerMute"
            />
        </div>
        <VcSlider
            v-model="speakerPlayerVolume"
            placement="left"
        />
    </div>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue'
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

</script>
<style lang="scss" scoped>
.volume-block{
  .active {
    background-color:
        color-mix(in srgb, var(--destructive) var(--dynamic-percentage-10), transparent);
  }
}
</style>
<style lang="scss">
.el-slider {
  max-width: 250px;
  .el-slider__runway, .el-slider__bar  {
    height: 2px;
  }


  .el-slider__runway {
    .el-slider__button-wrapper .el-slider__button {
      height: 15px;
      width: 15px;
    }
  }
}

</style>
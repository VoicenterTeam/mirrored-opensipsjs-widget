<template>
    <div class="speaker-manager-wrapper flex items-center w-full gap-x-2 gap-y-1">
        <SpeakerManager class="item" />
        <MuteManager class="item" />
    </div>
</template>
<script lang="ts" setup>
import SpeakerManager from '@/components/phone/SpeakerManager.vue'
import MuteManager from '@/components/phone/MuteManager.vue'
</script>
<style lang="scss" scoped>
.speaker-manager-wrapper {
  overflow: hidden;
  box-shadow: 0px 10px 20px -19px var(--card-shadow-color);
  border-bottom: 0.5px solid var(--ui-lines);
  .item {
    flex: 1
  }
}
</style>
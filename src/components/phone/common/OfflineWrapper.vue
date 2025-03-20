<template>
    <div
        v-show="!isOpenSIPSReady"
        class="offline-wrapper"
    >
        <div class="offline-wrapper-content">
            <div class="offline-icon flex items-center justify-center mb-8">
                <i class="vc-icon-unplug text-3xl" />
            </div>
            <div class="offline-header text-2xl font-semibold text-center mb-5">
                <span>No connection</span>
            </div>
            <div class="offline-description text-lg text-center mb-8">
                <p>No socket connection</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { isOpenSIPSReady } from '@/composables/opensipsjs'


</script>

<style lang="scss" scoped>
.offline-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(97, 97, 97, 0.9);
  transition: 0.3s ease;
  z-index: 999999;
}
.offline-wrapper-content {
  @apply flex flex-col items-center;
  color: #fff;
  padding: 40px;

  p {
    color: #fff;

    & + p {
      margin-top: 0.33em;
    }
  }
}
.offline-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.1);
}

</style>

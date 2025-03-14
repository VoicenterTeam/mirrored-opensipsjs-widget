<template>
    <div
        class="hide-all-button py-2 px-3 font-inter font-semibold cursor-pointer"
        @click="onIncomingCallsHide"
    >
        hide all
    </div>
</template>
<script lang="ts" setup>
import { useIncomingCalls } from '@/composables/phone/useIncomingCalls.ts'
const { hideIncomingCall, visibleCalls } = useIncomingCalls()


const onIncomingCallsHide = () => {
    visibleCalls.value.forEach(call => {
        hideIncomingCall(call._id)
    })
}
</script>
<style lang="scss" scoped>
.hide-all-button {
  border-radius: 152px;
  border: 1px var(--active-call-bg);
  background: var(--phone-bg-white);
  box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.14);
  color: var(--text-secondary);
  font-size: 11px;
  letter-spacing: 1.1px;
  width: 77px;
  text-transform: uppercase;
  margin: 0 auto;
  text-wrap: nowrap;
}
</style>

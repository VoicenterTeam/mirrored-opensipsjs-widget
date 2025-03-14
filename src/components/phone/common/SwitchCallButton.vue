<template>
    <button
        :class="{'active': isActiveCallsPopupActive}"
        class="switch-call-button relative inline-flex rounded-md"
        @click="onActiveCallsPopupToggle(!isActiveCallsPopupActive)"
    >
        <div class="flex justify-between gap-x-1 items-center  px-2 py-1 ">
            <i class="vc-lc-arrow-right-left text-base" />
            <span class="context uppercase whitespace-nowrap">manage calls</span>
        </div>
    </button>
</template>
<script lang="ts" setup>
import { usePhoneState } from '@/composables/phone/usePhoneState'
/* Data */
const { onActiveCallsPopupToggle, isActiveCallsPopupActive } = usePhoneState()
</script>
<style lang="scss" scoped>
.switch-call-button {
  background-color: color-mix(in srgb, var(--secondary) var(--dynamic-percentage-10), transparent);
  &:hover {
    background-color:
        color-mix(in srgb, var(--secondary-actions) var(--dynamic-percentage-10-hover), transparent);
  }
  i {
    color: var(--default-text);
  }
  .context {
    font-size: 11px;
    font-weight: 680;
    letter-spacing: 1.1px;
    text-transform: uppercase;
    color:
        color-mix(in srgb, var(--default-text) 60%, var(--actions-mix-color));
  }

}
.active {
  @apply bg-active-elements;
  .context {
    color: white;
  }

  i {
    @apply text-white;
  }
  &:hover {
    @apply bg-active-elements--focus;
  }
}
</style>

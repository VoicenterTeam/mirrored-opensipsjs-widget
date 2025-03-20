<template>
    <div
        :class="{'active': active, 'active-bg': activeBg}"
        class="transfer-btn cursor-pointer h-9 w-9"
        @click="handleTransfer"
    >
        <i class="vc-lc-forward text-xl" />
    </div>
</template>
<script setup lang="ts">

import useCallActions from '@/composables/phone/useCallActions.ts'
/* Data */

const {  onCallTransfer } = useCallActions()

/* Props */
interface Props {
    number?: string,
    active?: boolean,
    activeBg?: boolean
}
const props = withDefaults(
    defineProps<Props>(),
    {
        active: false,
        activeBg: false,
        number: ''
    }
)
/* Methods */
const handleTransfer = () => {
    if(!props.number) {
        return
    }

    onCallTransfer(`${props.number}`)
}
</script>
<style lang="scss" scoped>
.transfer-btn {
  @apply flex items-center justify-center rounded-full;
  flex-shrink: 0;
  flex-grow: 0;
  background-color: var(--phone-border);

  i {
    color: var(--secondary);
  }

  &.active {
    i {
      color: var(--primary);
    }
  }
  &.active-bg {
    @apply bg-primary;
    i {
      color: var(--btn-filled-text);
    }
  }
}
</style>

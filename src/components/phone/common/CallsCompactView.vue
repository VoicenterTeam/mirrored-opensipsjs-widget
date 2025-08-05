<template>
    <div class="flex justify-between items-center py-2 compact-view-wrapper gap-x-3">
        <div
            class="flex justify-between gap-x-2 items-center active-calls-wrapper"
        >
            <i class="vc-lc-phone-call" />
            <div class="counter uppercase">
                {{ `${roomsLength} ${getTranslation('audio.calls')}` }}
                {{ `${callsLength} ${getTranslation('audio.callers')}` }}
            </div>
        </div>
        <div class="flex items-center justify-between gap-x-1">
            <SwitchCallButton />
        </div>
    </div>
</template>
<script lang="ts" setup>
import SwitchCallButton from '@/components/phone/common/SwitchCallButton.vue'
import { getTranslation } from '@/plugins/translator'

/* Props */
type Props = {
    roomsLength: number,
    callsLength: number
}
defineProps<Props>()

</script>
<style lang="scss" scoped>
.compact-view-wrapper {
  border-bottom: 0.5px solid var(--ui-lines);
  .active-calls-wrapper {
    .counter {
      line-height: normal;
      font-weight: 500;
      font-size: 10px;
      letter-spacing: 1.1px;
      color: var(--default-text);
    }
    i {
      font-size: 18px;
      color: color-mix(in srgb, var(--secondary) 80%, transparent);;
    }
  }

  .not-active-call-wrapper {
    .duration, .dot, .caller {
      color: var( --time-grey);
    }

    .dot {
      line-height: 1;
    }
    .duration {
      min-width: 53px;
    }
  }

  .merge-icon-wrapper, .transfer-icon-wrapper {
    background-color: var(--bg-light-grey);
    i {
      color: var(--call-details);
    }
  }
}
</style>

<template>
    <div
        ref="callsCompactViewRef"
        class="flex justify-between items-center compact-view-wrapper"
        :class="[isXsLayout ? 'py-1 gap-x-1 is-xs' : 'py-2 gap-x-3']"
    >
        <div
            class="flex justify-between items-center active-calls-wrapper min-w-0"
            :class="isXsLayout ? 'gap-x-1' : 'gap-x-2'"
        >
            <i class="vc-lc-phone-call shrink-0" />
            <div class="counter uppercase truncate">
                {{ `${roomsLength} ${getTranslation('audio.calls')}` }}
                {{ `${callsLength} ${getTranslation('audio.callers')}` }}
            </div>
        </div>
        <div class="flex items-center justify-between gap-x-1 shrink-0">
            <SwitchCallButton />
        </div>
    </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import SwitchCallButton from '@/components/phone/common/SwitchCallButton.vue'
import { useMainWrapperHeight } from '@/composables/phone/useMainWrapperHeight'
import { getTranslation } from '@/plugins/translator'

/* Props */
type Props = {
    roomsLength: number,
    callsLength: number
}
defineProps<Props>()

const callsCompactViewRef = ref<HTMLElement | null>(null)
const { isXsLayout } = useMainWrapperHeight(callsCompactViewRef)
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

  &.is-xs {
    .active-calls-wrapper {
      .counter {
        font-size: 9px;
        letter-spacing: 0.5px;
      }
      i {
        font-size: 14px;
      }
    }

    :deep(.switch-call-button) {
      > div {
        padding-left: 6px;
        padding-right: 6px;
        padding-top: 2px;
        padding-bottom: 2px;
      }
      .context {
        font-size: 9px;
        letter-spacing: 0.4px;
      }
      i {
        font-size: 12px;
      }
    }
  }
}
</style>

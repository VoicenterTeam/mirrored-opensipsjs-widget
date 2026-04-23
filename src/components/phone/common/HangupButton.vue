<template>
    <button
        ref="hangupButtonRef"
        class="main-hangup-button rounded-full flex items-center justify-center"
        :class="[size]"
        :style="hangupButtonSizeStyle"
    >
        <i class="vc-icon-phone-down" />
    </button>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import { useMainWrapperHeight } from '@/composables/phone/useMainWrapperHeight'

/* Props */
interface Props {
    size?: 'small' | 'large'

}
const props = withDefaults(
    defineProps<Props>(),
    {
        size: 'large'
    }
)

const COMPACT_THRESHOLD_HEIGHT = 500
const COMPACT_BUTTON_SIZE = 44
const DEFAULT_LARGE_BUTTON_SIZE = 56

const hangupButtonRef = ref<HTMLElement | null>(null)
const { mainWrapperHeight } = useMainWrapperHeight(hangupButtonRef)

const hangupButtonSizeStyle = computed(() => {
    if (props.size !== 'large') {
        return undefined
    }

    const currentHeight = mainWrapperHeight.value
    const size = currentHeight && currentHeight < COMPACT_THRESHOLD_HEIGHT
        ? COMPACT_BUTTON_SIZE
        : DEFAULT_LARGE_BUTTON_SIZE

    return {
        width: `${size}px`,
        height: `${size}px`,
    }
})
</script>
<style lang="scss" scoped>
.main-hangup-button {
  @apply bg-destructive-actions border-destructive-actions;

  i {
    color: var(--white);
  }

  &.small {
    @apply h-8 w-8;
  }
  &.large {
    i {
      font-size: 1.5rem;
    }
  }

  &:hover,
  &:focus {
    @apply bg-destructive-actions--focus border-destructive-actions--focus  text-btn-filled-text;
  }
  &:active {
    @apply bg-destructive-actions--pressed border-destructive-actions--pressed  text-btn-filled-text;
  }
}
</style>

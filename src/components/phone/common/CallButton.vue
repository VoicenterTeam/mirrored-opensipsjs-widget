<template>
    <button
        ref="callButtonRef"
        class="call-button rounded-full flex items-center justify-center"
        :class="[size]"
        :style="callButtonSizeStyle"
    >
        <i class="vc-icon-phone" />
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

const XS_BUTTON_SIZE = 36
const COMPACT_BUTTON_SIZE = 44
const DEFAULT_LARGE_BUTTON_SIZE = 56

const callButtonRef = ref<HTMLElement | null>(null)
const { isCompactLayout, isXsLayout } = useMainWrapperHeight(callButtonRef)

const callButtonSizeStyle = computed(() => {
    if (props.size !== 'large') {
        return undefined
    }

    let size: number
    if (isXsLayout.value) {
        size = XS_BUTTON_SIZE
    } else if (isCompactLayout.value) {
        size = COMPACT_BUTTON_SIZE
    } else {
        size = DEFAULT_LARGE_BUTTON_SIZE
    }

    return {
        width: `${size}px`,
        height: `${size}px`,
    }
})
</script>
<style lang="scss" scoped>
.call-button {
  @apply bg-success-actions border-success-actions h-full w-full;
  i {
    color: var(--white);
  }

  &.small {}
  &.large {
    i {
      font-size: 1.5rem;
    }
  }

  &:hover,
  &:focus {
    @apply bg-success-actions--focus border-success-actions--focus text-btn-filled-text;
  }
  &:active {
    @apply bg-success-actions--pressed border-success-actions--pressed  text-btn-filled-text;
  }
}
</style>

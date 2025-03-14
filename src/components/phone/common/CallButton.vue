<template>
    <button
        class="call-button rounded-full flex items-center justify-center"
        :class="[size]"
    >
        <i class="vc-icon-phone" />
    </button>
</template>
<script setup lang="ts">

/* Props */
interface Props {
    size?: 'small' | 'large'

}
withDefaults(
    defineProps<Props>(),
    {
        size: 'large'
    }
)

</script>
<style lang="scss" scoped>
.call-button {
  @apply bg-success-actions border-success-actions h-full w-full;
  i {
    color: var(--white);
  }

  &.small {}
  &.large {
    @apply h-14 w-14;

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

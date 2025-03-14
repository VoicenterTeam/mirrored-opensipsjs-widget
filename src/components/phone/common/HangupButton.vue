<template>
    <button
        class="main-hangup-button rounded-full flex items-center justify-center"
        :class="[size]"
    >
        <i class="vc-icon-phone-down" />
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
.main-hangup-button {
  @apply bg-destructive-actions border-destructive-actions;

  i {
    color: var(--white);
  }

  &.small {
    @apply h-8 w-8;
  }
  &.large {
    @apply h-14 w-14;

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

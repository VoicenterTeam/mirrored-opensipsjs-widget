<template>
    <button
        class="dnd-button-container flex justify-center items-center h-10 w-10"
        :class="{'active':disturbValue}"
        @click="toggleDND"
    >
        <i
            class="text-xl vc-lc-phone-off"
        />
    </button>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import { useOpenSIPSJS } from '@/composables/opensipsjs.ts'


/* Data */
const disturbValue = ref(false)
const { getAudioState, getAudioApi } = useOpenSIPSJS()
const { isDND } = getAudioState()
const { setDND } = getAudioApi()

/* Watchers */
watch(
    isDND,
    (dnd) => {
        disturbValue.value = !!dnd
    },
    {
        immediate: true
    }
)

/* Methods */
const toggleDND = () => {
    setDND(!disturbValue.value)
}
</script>
<style lang="scss">
.dnd-button-container {
  border-radius: 6px;
  background-color:
      color-mix(in srgb, var(--secondary) var(--dynamic-percentage-10), transparent);
  i {
    @apply text-inactive-text;
  }

  &:hover {
    background-color:
        color-mix(in srgb, var(--secondary-actions) var(--dynamic-percentage-10-hover), transparent);
    i {
      @apply text-destructive;
    }
  }

  &.active {
    @apply bg-destructive;

    i {
      @apply text-white;
    }
    &:hover {
      @apply bg-destructive-actions--focus;
      i {
        @apply text-white;
      }
    }
  }
  svg {
    margin: 0 auto;
  }
}
</style>


<template>
    <button
        class="back-button flex items-center justify-center py-1 pl-1.5 pr-2 gap-x-1.5"
        @click="onClick"
    >
        <i class="vc-lc-arrow-left text-xs" />
        <div class="title">
            {{ getTranslation('audio.back') }}
        </div>
    </button>
</template>
<script setup lang="ts">
import { getTranslation } from '@/plugins/translator'

/* Emits */
const emit = defineEmits<{
    (event: 'click'): void,
}>()

/* Methods */
const onClick = () => {
    emit('click')
}
</script>
<style lang="scss" scoped>
.back-button {
  border-radius: 100px;
  background-color: var(--active-elements);

  .title {
    color: var(--white);
    font-size: 10px;
    font-weight: 680;
    line-height: 150%;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
  i {
    color: var(--btn-filled-text);
  }

  &:hover {
    @apply bg-active-elements--focus;
  }
}



</style>

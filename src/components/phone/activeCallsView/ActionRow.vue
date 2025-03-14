<template>
    <div class="action-row-container py-2.5 px-1.5 flex items-center justify-between">
        <div class="flex items-center">
            <i
                :class="[icon, 'mr-1.5 text-base']"
                :style="{ color: color }"
            />
            <span class="action-row-container__item open-sans font-semibold">
                {{ title }}
            </span>
        </div>
        <slot />
    </div>
</template>
<script setup lang="ts">

/* Props */
interface Props {
    title: string,
    icon?: string,
    color?: string
}
defineProps<Props>()

</script>
<style lang="scss" scoped>
.action-row-container {
  border-radius: 6px;
  border:  0.5px solid var(--ui-lines);

  &__item {
    font-size: 13px;
    color: var(--default-text);
  }
}
</style>

<template>
    <Popper v-bind="$attrs" arrow>
        <slot />
        <template #content="props">
            <slot name="content" v-bind="props" />
        </template>
    </Popper>
</template>

<script lang="ts" setup>
import Popper from "vue3-popper";
</script>

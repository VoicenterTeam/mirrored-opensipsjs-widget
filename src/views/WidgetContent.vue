<template>
    <div>
        <NotInitializedView v-if="!isOpenSIPSReady" />
        <InitializedView v-else />
    </div>
</template>

<script setup lang="ts">
import { isOpenSIPSReady } from '@/composables/opensipsjs'
import NotInitializedView from '@/views/NotInitializedView.vue'
import InitializedView from '@/views/InitializedView.vue'
</script>
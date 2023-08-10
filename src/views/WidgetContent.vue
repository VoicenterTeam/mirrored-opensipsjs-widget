<template>
    <div v-loading="isLoading">
        <NotInitializedView v-if="!isOpenSIPSReady" />
        <InitializedView v-else />
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { isOpenSIPSReady, allCallStatuses } from '@/composables/opensipsjs'
import NotInitializedView from '@/views/NotInitializedView.vue'
import InitializedView from '@/views/InitializedView.vue'

const isLoading = ref<boolean>(false)

watch(allCallStatuses, (statuses) => {
    if (statuses && statuses.length) {
        const isInLoadingState = statuses.some(status => status.isMerging || status.isMoving || status.isTransferring)
        isLoading.value = isInLoadingState
    } else {
        isLoading.value = false
    }
}, { deep: true })

</script>
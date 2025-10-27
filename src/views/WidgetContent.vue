<template>
    <div v-loading="isLoading">
        <NotInitializedView v-if="!isOpenSIPSReady" />
        <InitializedView v-else />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { isOpenSIPSReady, useOpenSIPSJS } from '@/composables/opensipsjs'
import NotInitializedView from '@/views/NotInitializedView.vue'
import InitializedView from '@/views/InitializedView.vue'

const { getAudioState, getAudioApi } = useOpenSIPSJS()
const { allCallStatuses } = getAudioState()
const { setMicrophonePermissionAllowed } = getAudioApi()

const isLoading = ref<boolean>(false)

watch(allCallStatuses, (statuses) => {
    if (statuses && statuses.length) {
        const isInLoadingState = statuses.some(status => status.isMerging || status.isMoving || status.isTransferring)
        isLoading.value = isInLoadingState
    } else {
        isLoading.value = false
    }
}, { deep: true })

onMounted(() => {
    if (!navigator.permissions) return

    navigator.permissions.query({ name: 'microphone' })
        .then(function (permissionStatus) {
            console.log('permissionStatus.state', permissionStatus.state)
            setMicrophonePermissionAllowed(permissionStatus.state === 'granted')

            permissionStatus.onchange = function () {
                console.log('permissionStatus.state change', permissionStatus.state)
                setMicrophonePermissionAllowed(permissionStatus.state === 'granted')
            }
        }).catch(() => {
            setMicrophonePermissionAllowed(false)
        })
})
</script>

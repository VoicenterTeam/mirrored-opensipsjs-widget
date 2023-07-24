<template>
    <div>
        This is Phone page
        <div>
            <button @click="makeCall">Call</button>
        </div>
        <div>
            <button @click="openSettingsPage">Settings</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { isSettingsPageOpened } from '@/composables/useWidgetState'

function makeCall (event: Event) {
    event.preventDefault()
    console.log('Make a call')
    // startCall('380937369802', false)
}

function openSettingsPage () {
    isSettingsPageOpened.value = true
}
</script>
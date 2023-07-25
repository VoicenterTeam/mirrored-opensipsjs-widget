<template>
    <div class="phone-container">
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
import { useOpenSIPSJS } from '@/composables/opensipsjs'

const { startCall } = useOpenSIPSJS()

function makeCall (event: Event) {
    event.preventDefault()
    startCall('665', false)
}

function openSettingsPage () {
    isSettingsPageOpened.value = true
}
</script>
<template>
    <div>
        This is Settings page
        <MediaDevicesSettings />
        <div>
            <button @click="closeSettingsPage">Close</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import MediaDevicesSettings from '@/components/MediaDevicesSettings.vue'
import { isSettingsPageOpened } from '@/composables/useWidgetState'

function closeSettingsPage () {
    isSettingsPageOpened.value = false
}
</script>
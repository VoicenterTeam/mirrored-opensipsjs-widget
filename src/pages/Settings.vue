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
import { useWidgetState } from '@/composables/useWidgetState'

/* Composable */
const { closeSettingsPage } = useWidgetState()
</script>

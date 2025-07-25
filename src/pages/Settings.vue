<template>
    <div>
        {{ getTranslation('pages.settings.title') }}
        <MediaDevicesSettings />
        <div>
            <button @click="closeSettingsPage">{{ getTranslation('common.close') }}</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import MediaDevicesSettings from '@/components/MediaDevicesSettings.vue'
import { useWidgetState } from '@/composables/useWidgetState'
import { getTranslation } from '@/plugins/translator'

/* Composable */
const { closeSettingsPage } = useWidgetState()
</script>

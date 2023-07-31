<template>
    <div>
        <NotInitializedView v-if="false" />
        <InitializedView v-else />
    </div>
</template>

<script setup lang="ts">
import { isSettingsPageOpened } from '@/composables/useWidgetState'
import { useOpenSIPSJS } from '@/composables/opensipsjs'
import { useActiveTab } from '@/plugins/activeTabPlugin'
import ActionButtons from '@/components/ActionButtons.vue'
import NotInitializedView from '@/views/NotInitializedView.vue'
import InitializedView from '@/views/InitializedView.vue'

const { startCall } = useOpenSIPSJS()
const { isActiveTab, activateTab } = useActiveTab()

function makeCall (event: Event) {
    event.preventDefault()
    startCall('665', false)
}

function openSettingsPage () {
    isSettingsPageOpened.value = true
}
</script>
<template>
    <div className="flex h-full flex-row">
        <div v-if="!allowShrinkOnIdle" className="w-[60px] text-primary p-3">
            <ConnectToServerIcon/>
        </div>
        <div :className="`flex items-center justify-center bg-danger uppercase text-button-pressed-text ${messageFontClasses}`">
            <span className="text-center">
                Not connected to server
            </span>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import ConnectToServerIcon from '@/assets/icons/connectToServer.svg?component'

import { allowShrinkOnIdle } from '@/composables/useCallSettingsPermissions'

const messageFontClasses = computed(() => {
    if (allowShrinkOnIdle.value) {
        return 'max-w-[120px] text-xxs p-2'
    } else {
        return 'text-sm p-3'
    }
})
</script>

<style scoped>

</style>

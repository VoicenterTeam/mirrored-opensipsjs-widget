<template>
    <div :className="wrapperClasses">
        <div v-if="!allowShrinkOnIdle" class="w-[60px] text-primary p-3">
            <ConnectToServerIcon/>
        </div>
        <div class="flex items-center bg-danger p-3 uppercase text-button-pressed-text text-sm">
            <span>
                Not connected to server yet
            </span>
        </div>
        <div v-if="allowShrinkOnIdle" class="secondary-bg">
            <SettingsIconButton className="border-r-1 border-border-lines" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import ConnectToServerIcon from '@/assets/icons/connectToServer.svg?component'

import { allowShrinkOnIdle } from '@/composables/useCallSettingsPermissions'
import SettingsIconButton from '@/components/SettingsIconButton.vue'

const wrapperClasses = computed(() => {
    let classes = 'flex h-full'
    if (!allowShrinkOnIdle.value) {
        classes += 'flex-row'
    } else {
        classes += ' flex-col'
    }

    return classes
})

</script>

<style scoped>

</style>

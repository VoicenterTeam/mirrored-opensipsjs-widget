<template>
    <div className="flex h-full flex-row">
        <div
            v-if="!allowShrinkOnIdle"
            className="w-[60px] text-primary p-3 bg-primary-bg"
        >
            <ConnectToServerIcon />
        </div>
        <div :className="`flex items-center justify-center bg-danger uppercase text-button-pressed-text ${messageFontClasses}`">
            <span className="text-center">
                {{ getTranslation('audio.not.connected.to.server') }}
            </span>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import ConnectToServerIcon from '@/assets/icons/connectToServer.svg?component'
import { getTranslation } from '@/plugins/translator'
import { allowShrinkOnIdle } from '@/composables/useWidgetConfig'

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

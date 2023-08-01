<template>
    <div :className="wrapperClasses">
        <div v-if="!allowShrinkOnIdle" className="w-[60px] text-primary p-1 ml-3">
            <!--            <ConnectToServerIcon/>-->
            <WidgetIconButton
                color="secondary"
                :icon="StartIcon"
                size="xl"
                additional-classes="rounded-full p-3"
                @click="activateTab" />
        </div>
        <div :className="`flex items-center justify-center uppercase ${messageFontClasses}`">
            <span className="text-center font-bold text-secondary-text">
                Activate
            </span>
        </div>
        <div v-if="allowShrinkOnIdle" className="bg-secondary-bg">
            <SettingsIconButton buttonClasses="border-r border-border-lines" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import StartIcon from '@/assets/icons/start.svg?component'
import { allowShrinkOnIdle } from '@/composables/useCallSettingsPermissions'
import SettingsIconButton from '@/components/SettingsIconButton.vue'

import { useActiveTab } from '@/plugins/activeTabPlugin'
import WidgetIconButton from '@/components/base/WidgetIconButton.vue'

const { activateTab } = useActiveTab()

const wrapperClasses = computed(() => {
    let classes = 'flex h-full '
    if (allowShrinkOnIdle.value) {
        classes += 'flex-col'
    } else {
        classes += 'w-[354px] flex-row'
    }

    return classes
})

const messageFontClasses = computed(() => {
    if (allowShrinkOnIdle.value) {
        return 'w-[120px] min-h-[32px] text-xxs p-2'
    } else {
        return 'text-sm p-3'
    }
})

</script>

<style scoped>

</style>

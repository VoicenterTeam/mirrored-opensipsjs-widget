<template>
    <div className="flex bg-inactive-bg h-[60px] flex-row">
        <div :className="activateButtonClasses">
            <!--            <ConnectToServerIcon/>-->
            <WidgetIconButton
                color="success"
                :icon="StartIcon"
                size="xl"
                additional-classes="rounded-full p-3.5"
                @click="activateTab" />
        </div>
        <div v-if="!allowShrinkOnIdle" :className="`flex items-center px-4 justify-start uppercase w-[270px]`">
            <span className="text-center font-bold text-button-pressed-text">
                Activate
            </span>
        </div>
        <!--        <div v-if="allowShrinkOnIdle" className="bg-secondary-bg">
            <SettingsIconButton buttonClasses="border-r border-border-lines" />
        </div>-->
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

const activateButtonClasses = computed(() => {
    let classes = 'text-primary p-1 '
    if (allowShrinkOnIdle.value) {
        classes += 'px-8'
    } else {
        classes += 'px-4'
    }

    return classes
})

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

<template>
    <div className="flex bg-inactive-bg h-[60px] flex-row">
        <div :className="activateButtonClasses">
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
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import StartIcon from '@/assets/icons/start.svg?component'
import { allowShrinkOnIdle } from '@/composables/useCallSettingsPermissions'

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

</script>

<style scoped>

</style>

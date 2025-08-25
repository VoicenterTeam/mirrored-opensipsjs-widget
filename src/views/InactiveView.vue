<template>
    <div className="flex bg-inactive-bg h-[60px] flex-row">
        <div :className="activateButtonClasses">
            <WidgetIconButton
                color="success"
                :icon="StartIcon"
                :disabled="!canActivate"
                size="xl"
                additional-classes="rounded-full p-3.5"
                @click="activateTab"
            />
        </div>
        <div
            v-if="!allowShrinkOnIdle"
            :className="`flex items-center px-4 justify-start uppercase w-[270px]`"
        >
            <span className="text-center font-bold text-button-pressed-text">
                {{ getTranslation('audio.activate') }}
            </span>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import StartIcon from '@/assets/icons/start.svg?component'
import { allowShrinkOnIdle } from '@/composables/useWidgetConfig'

import { useActiveTab } from '@/composables/useActiveTab'
import WidgetIconButton from '@/components/base/WidgetIconButton.vue'
import { getTranslation } from '@/plugins/translator'

const { canActivate, activateTab } = useActiveTab()

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

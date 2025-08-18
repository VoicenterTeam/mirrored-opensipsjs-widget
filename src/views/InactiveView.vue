<template>
    <div className="flex bg-primary-actions-bg--focus h-[60px] flex-row">
        <div :className="activateButtonClasses">
            <!--            <WidgetIconButton
                color="primary-actions"
                pressed-color="primary-actions-bg&#45;&#45;focus"
                :icon="StartIcon"
                :disabled="disableButton"
                size="xl"
                additional-classes="rounded-full p-3.5 border border-primary-actions"
                @click="activateTab"
            />-->
            <div
                class="activate-button"
                @click="activateTab"
            >
                <i class="vc-lc-circle-power text-primary-actions hover:text-primary-actions-bg--focus" />
            </div>
        </div>
        <div
            v-if="!allowShrinkOnIdle"
            :className="`flex items-center px-4 justify-start uppercase w-[270px]`"
        >
            <span className="text-center font-bold text-primary-actions">
                {{ getTranslation('audio.activate') }}
            </span>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import StartIcon from '@/assets/icons/start.svg?component'
import { allowShrinkOnIdle } from '@/composables/useWidgetConfig'

import { useActiveTab } from '@/plugins/activeTabPlugin'
import WidgetIconButton from '@/components/base/WidgetIconButton.vue'
import { getTranslation } from '@/plugins/translator'

const { isActiveTab, tabIdWithActiveCall, activateTab } = useActiveTab()

const activateButtonClasses = computed(() => {
    let classes = 'text-primary p-1 pr-0 '
    if (allowShrinkOnIdle.value) {
        classes += 'px-8'
    } else {
        classes += 'px-4'
    }

    return classes
})

const disableButton = computed(() => {
    return !isActiveTab.value && !!tabIdWithActiveCall.value
})

</script>

<style scoped>
.activate-button {
  display: flex;
  align-items: center;
  height: 100%;
}
.activate-button i {
  font-size: 40px;
  margin: auto 0;
  align-self: center;
  cursor: pointer;
}
</style>

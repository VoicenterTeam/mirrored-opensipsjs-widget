<template>
    <div className="flex bg-primary-actions-bg--focus h-[60px] flex-row p-1">
        <div :className="activateButtonClasses">
            <div
                class="activate-button"
                @click="activateTab"
            >
                <i class="vc-lc-circle-power text-primary-actions hover:text-primary-actions-bg--focus" />
            </div>
        </div>
        <div
            v-if="!allowShrinkOnIdle"
            class="flex items-center pr-2 justify-start"
        >
            <span class="text-center font-semibold text-primary-actions">
                {{ getTranslation('audio.activate.widget.here') }}
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

// TODO: add condition to button for disable="!canActivate"

const activateButtonClasses = computed(() => {
    let classes = 'text-primary p-1 '
    if (allowShrinkOnIdle.value) {
        classes += 'px-8'
    } else {
        classes += 'px-2'
    }

    return classes
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

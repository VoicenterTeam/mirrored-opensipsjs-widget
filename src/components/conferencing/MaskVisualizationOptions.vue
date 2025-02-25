<template>
    <div>
        <VcPopover
            :open="popoverVisibility"
            trigger="manual"
            :popover-width="200"
        >
            <template #reference>
                <VcButton
                    size="large"
                    @click="openPopover"
                >
                    Blur options
                </VcButton>
            </template>

            <div class="p-5">
                <div class="mb-2">
                    <label>Blur amount</label>
                    <div class="w-full">
                        <VcSlider
                            v-model="blurAmountModel"
                            :min="1"
                            :max="20"
                            :step="1"
                        />
                    </div>
                </div>

                <VcButton @click="closePopover">
                    Close
                </VcButton>
            </div>
        </VcPopover>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { VcPopover, VcSlider, VcButton } from '@voicenter-team/voicenter-ui-plus'
import { debounce } from 'lodash'

import {
    usedWidgetShadowRootEl
} from '@/composables/opensipsjs'

export interface Props {
    setupVisualizationConfig: (config: unknown) => void
}

const props = withDefaults(
    defineProps<Props>(),
    {})

/* Data */
const popoverVisibility = ref<boolean>(false)
const blurAmountModel = ref<number>(15)

const debouncedFn = debounce((newV: number) => {
    const config: unknown = {
        backgroundBlur: newV
    }
    props.setupVisualizationConfig(config)
}, 200)

/* Watch */
watch(blurAmountModel, (newV) => {
    debouncedFn(newV)
})

/* Methods */
const openPopover = () => {
    popoverVisibility.value = true
}

const closePopover = () => {
    popoverVisibility.value = false
}
</script>

<style scoped>

</style>

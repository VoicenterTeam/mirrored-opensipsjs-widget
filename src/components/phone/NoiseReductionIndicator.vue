<template>
    <div
        v-if="showIndicator"
        class="flex items-center justify-center"
        style="height: 30px; width: 30px;"
    >
        <div
            :class="{ 'active': isActive }"
            class="noise-reduction-indicator"
            :title="getTitle"
        >
            <i
                class="vc-lc-waves text-sm"
                :style="{ color: isActive ? 'white' : 'var(--primary)' }"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { noiseReductionMode } from '@/composables/useWidgetConfig'
import { useOpenSIPSJS } from '@/composables/opensipsjs'
import { getTranslation } from '@/plugins/translator'

/* Data */
const { getAudioState } = useOpenSIPSJS()
const { noiseReductionState } = getAudioState()

/* Computed */
const showIndicator = computed(() => {
    return noiseReductionMode.value === 'enabled' || noiseReductionMode.value === 'dynamic'
})

const isActive = computed(() => {
    // For 'enabled' mode, it's always active
    if (noiseReductionMode.value === 'enabled') {
        return true
    }

    // For 'dynamic' mode, check the actual runtime state from opensips-js-vue
    if (noiseReductionMode.value === 'dynamic') {
        return noiseReductionState?.value === true
    }

    return false
})

const getTitle = computed(() => {
    if (noiseReductionMode.value === 'enabled') {
        return getTranslation('audio.noise.reduction.always.on')
    }
    if (noiseReductionMode.value === 'dynamic') {
        if (noiseReductionState?.value === true) {
            return getTranslation('audio.noise.reduction.dynamic.active')
        }
        return getTranslation('audio.noise.reduction.dynamic.inactive')
    }
    return getTranslation('audio.noise.reduction.off')
})
</script>

<style lang="scss" scoped>
.noise-reduction-indicator {
    height: 22px;
    width: 22px;
    background-color: transparent;
    transition: all 0.2s ease;
    cursor: help;
    border-radius: 50%;

    &.active {
        background-color: var(--destructive);
    }

    &:hover:not(.active) {
        background-color: color-mix(in srgb, var(--primary) var(--dynamic-percentage-15), transparent);
    }

    i {
        transition: color 0.2s ease;
    }
}
</style>

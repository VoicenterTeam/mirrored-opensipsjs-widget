<template>
    <div>
        <VcPopover
            :open="popoverVisibility"
            trigger="manual"
            :teleported="false"
            :popover-width="200"
        >
            <template #reference>
                <VcButton
                    size="large"
                    @click="openPopover"
                >
                    {{ getTranslation('video.drawing.options') }}
                </VcButton>
            </template>

            <div class="p-5">
                <div class="mb-2">
                    <label>{{ getTranslation('video.brush.width') }}</label>
                    <div class="w-full">
                        <VcSlider
                            v-model="strokeWidthModel"
                            :min="1"
                            :max="50"
                            :step="1"
                        />
                    </div>
                </div>

                <div class="flex mb-2">
                    <label class="mr-2">{{ getTranslation('video.brush.color') }}</label>
                    <input
                        v-model="strokeColorModel"
                        type="color"
                    >
                </div>

                <div
                    v-if="props.isExtendedOptions"
                    class="flex mb-2"
                >
                    <label class="mr-2">{{ getTranslation('video.background.color') }}</label>
                    <input
                        v-model="backgroundColorModel"
                        type="color"
                    >
                </div>

                <VcButton @click="applySettings">
                    {{ getTranslation('common.apply') }}
                </VcButton>
            </div>
        </VcPopover>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { VcPopover, VcSlider, VcButton } from '@voicenter-team/voicenter-ui-plus'
import { useOpenSIPSJS } from '@/composables/opensipsjs.ts'
import { getTranslation } from '@/plugins/translator'

const {
    setupDrawerOptions,
    setupScreenShareDrawerOptions,
} = useOpenSIPSJS()

type KonvaDrawerOptions = unknown

export interface Props {
    isExtendedOptions: boolean
    isScreenShareWhiteboardEnabled: boolean
}

const props = withDefaults(
    defineProps<Props>(),
    {
        isExtendedOptions: false
    })


const popoverVisibility = ref<boolean>(false)
const strokeWidthModel = ref<number>(2)
const strokeColorModel = ref<string>('#000')
const backgroundColorModel = ref<string>('#fff')

const openPopover = () => {
    popoverVisibility.value = true
}

const applySettings = () => {
    const options: KonvaDrawerOptions = {
        strokeWidth: strokeWidthModel.value,
        strokeColor: strokeColorModel.value,
        emptyDrawerRectColor: backgroundColorModel.value
    }

    if (!props.isExtendedOptions) {
        delete options.emptyDrawerRectColor
    }

    if (props.isScreenShareWhiteboardEnabled) {
        setupScreenShareDrawerOptions(options)
    } else {
        setupDrawerOptions(options)
    }

    popoverVisibility.value = false
}

</script>

<style scoped>

</style>

<template>
    <VcModal
        :visible="modalVisibleModel"
        :header="getTranslation('modals.mask.effect.options')"
        :breakpoints="{
            '1316px': '60vw','1126px': '70vw', '942px': '80vw', '824px': '95vw'
        }"
        width="50vw"
        :append-to="modalAppendToElement"
        @close="closeModal"
    >
        <div class="flex w-full h-full justify-between items-center sm:items-start flex-col sm:flex-row">
            <div class="mt-2">
                <VcButton
                    type="default"
                    color="primary"
                    icon="vc-icon-background-blur-1"
                    size="large"
                    @click="applyBokehEffect"
                >
                    {{ getTranslation('video.background.blur.effect') }}
                </VcButton>
            </div>

            <ImageUploadButton
                :button-text="getTranslation('video.background.image.effect')"
                @upload="applyBackgroundImgEffect"
            />
        </div>
    </VcModal>
</template>

<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { computed } from 'vue'
import { useVModel } from '@vueuse/core'
import { VcButton, VcModal } from '@voicenter-team/voicenter-ui-plus'
//import useJanusPhoneKit from '@/composables/useJanusPhoneKit'
import ImageUploadButton from '@/components/conferencing/ImageUploadButton.vue'
import {
    usedWidgetShadowRootEl,
    useOpenSIPSJS
} from '@/composables/opensipsjs'
import { getTranslation } from '@/plugins/translator'

const { getVideoApi } = useOpenSIPSJS()

const { applyBokehMaskEffect, applyBackgroundImgMaskEffect } = getVideoApi()

/* Props */
export interface Props {
    modalVisible?: boolean
}

const props = withDefaults(
    defineProps<Props>(),
    {
        modalVisible: false
    }
)

/* Emit */
export interface Emit {
    (e: 'update:modalVisible', payload: boolean): void
}

const emit = defineEmits<Emit>()

/* Data */
const modalVisibleModel = useVModel(props, 'modalVisible', emit)

const modalAppendToElement = computed(() => {
    if (usedWidgetShadowRootEl.value) {
        const el = usedWidgetShadowRootEl.value as HTMLElement
        return el || 'body'
    }
    return 'body'
})

/* Methods */
const closeModal = () => {
    modalVisibleModel.value = false
}

const applyBokehEffect = () => {
    applyBokehMaskEffect()
    closeModal()
}

const applyBackgroundImgEffect = (base64: string) => {
    applyBackgroundImgMaskEffect(base64)
    closeModal()
}

</script>

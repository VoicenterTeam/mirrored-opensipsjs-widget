<template>
    <VcModal
        :visible="modalVisibleModel"
        :header="getTranslation('video.whiteboard.options')"
        :breakpoints="{
            '1126px': '60vw', '942px': '80vw', '704px': '95vw', '599px': '75vw'
        }"
        width="50vw"
        append-to="self"
        @close="closeModal"
    >
        <div class="flex w-full h-full justify-between items-center xs:items-start flex-col xs:flex-row">
            <div class="my-2">
                <VcButton
                    type="default"
                    color="primary"
                    icon="vc-icon-edit-pencil"
                    size="large"
                    @click="drawEmptyWhiteboard"
                >
                    {{ getTranslation('video.empty.whiteboard') }}
                </VcButton>
            </div>

            <ImageUploadButton
                :button-text="getTranslation('video.image.whiteboard')"
                @upload="onImageUpload"
            />
        </div>
    </VcModal>
</template>

<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { useVModel } from '@vueuse/core'
import { VcButton, VcModal } from '@voicenter-team/voicenter-ui-plus'
import ImageUploadButton from '@/components/conferencing/ImageUploadButton.vue'
import { useOpenSIPSJS } from '@/composables/opensipsjs'
import { getTranslation } from '@/plugins/translator'

const { getVideoApi } = useOpenSIPSJS()

const { enablePresentationWhiteboard, enableImageWhiteboard } = getVideoApi()

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

/* Methods */
const closeModal = () => {
    modalVisibleModel.value = false
}

const drawEmptyWhiteboard = () => {
    enablePresentationWhiteboard()
    closeModal()
}

const onImageUpload = (base64: string) => {
    enableImageWhiteboard(base64)
    closeModal()
}

</script>

<template>
    <div>
        <VcFileUploader
            id="image-uploader"
            :files="files"
            :file-size-limit="fileSizeLimit"
            button-size="large"
            class="image-uploader"
            tag-icon="vc-icon-image"
            button-icon="vc-icon-image"
            :max-length="1"
            :button-text="buttonText"
            no-data-text="No image"
            accept="image/*"
            @input="onFileChange"
        />
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { VcFileUploader } from '@voicenter-team/voicenter-ui-plus'
import { FileUploaded } from '@voicenter-team/voicenter-ui-plus/library/types/components/VcFileUploader/VcFileUploader.types'

export interface Props {
    buttonText?: string
}

const props = withDefaults(
    defineProps<Props>(),
    {
        buttonText: ''
    }
)

/* Emit */
const emit = defineEmits<{
    (e: 'upload', payload: string): void
}>()

/* Computed */
const buttonText = computed(() => {
    return props.buttonText ? props.buttonText : 'Upload image'
})

const fileSizeLimit = ref<number>(5242880) // Bytes (in binary) - 5MB
const file = ref<FileUploaded | null>(null)
const files = ref<Array<FileUploaded>>([])

const onFileChange = (newFiles: FileUploaded[]) => {
    files.value = newFiles
    file.value = files.value[0]

    if (file.value) {
        const reader = new FileReader()

        reader.onload = function (event) {
            const base64String = event.target.result as string

            emit('upload', base64String)
        }

        reader.readAsDataURL(file.value)
    }
}
</script>

<style scoped lang="scss">
.image-uploader {
  :deep() {
    .vc-input__label-wrapper-label {
      white-space: nowrap;
      font-weight: 500;
      font-size: 14px;
    }
  }
}
</style>

<template>
    <VcFileUploader
        v-model="localModel"
        :multiple="false"
        :file-size-limit="fileSizeLimit"
        :accept="accept"
        file-type="base64"
        :label="label"
    />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { VcFileUploader, type FileUploaded } from '@voicenter-team/voicenter-ui-plus'
const MAX_FILE_SIZE = 5 * 1024 * 1024  // 5MB in bytes

const props = withDefaults(
    defineProps<{
        label: string,
        accept: string,
        modelValue: string | undefined,
        fileSizeLimit?: number
    }>(),
    {
        fileSizeLimit: MAX_FILE_SIZE
    }
)

const emit = defineEmits<{
    (e: 'update:modelValue', payload: string): void
}>()

const localModel = computed({
    get (): Array<FileUploaded> {
        const list: Array<FileUploaded> = []

        if (props.modelValue) {
            list.push({
                File: props.modelValue,
                ...new File(
                    [
                        new Blob([ props.modelValue ])
                    ],
                    'Uploaded File'
                )
            })
        }

        return list
    },
    set (files) {
        const file = files[files.length - 1]?.File

        if (typeof file === 'string') {
            emit('update:modelValue', file)
        }
    }
})
</script>

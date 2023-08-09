<template>
    <el-upload
            ref="upload"
            action="#"
            v-bind="$attrs"
            :multiple="false"
            :auto-upload="false"
            :show-file-list="false"
            :before-upload="handleUpload"
            @update:fileList="onFileListUpdate"
    >
        <el-button slot="trigger" size="small" type="primary">
            Select File
        </el-button>
    </el-upload>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { UploadUserFile } from 'element-plus'
const MAX_FILE_SIZE = 5 * 1024 * 1024;  // 5MB in bytes

const props = withDefaults(
    defineProps<{
        modelValue: string,
        maxSize?: number
    }>(),
    {
        maxSize: MAX_FILE_SIZE
    }
)

const emit = defineEmits<{
    'update:modelValue': (value: string) => void
}>()

const soundData = computed({
    get () {
        return props.modelValue
    },
    set (value) {
        emit('update:modelValue', value)
    }
})

const handleUpload = (file: UploadUserFile) => {
    if (file.raw.size > props.maxSize) {
        alert('File is too large')

        return false
    }

    const reader = new FileReader()

    reader.onload = function (e) {
        if (typeof e.target.result === 'string') {
            soundData.value = e.target.result
        }
    }

    reader.readAsDataURL(file.raw)

    return false
}

const onFileListUpdate = (fileList: Array<UploadUserFile>) => {
    const lastFile = fileList[fileList.length - 1]

    if (lastFile) {
        handleUpload(lastFile)
    }
}
</script>

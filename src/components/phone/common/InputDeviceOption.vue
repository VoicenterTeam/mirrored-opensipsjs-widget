<template>
    <div class="flex gap-x-1">
        <div class="flex">
            <VolumeLevelIndicator
                v-if="showIndicator && deviceId"
                :device-id="deviceId"
                :stream="stream"
            />
            <span
                v-else
                class="no-stream-area"
            />
        </div>
        <span class="option-label truncate">{{ label }}</span>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue'
import VolumeLevelIndicator from '@/components/phone/common/VolumeLevelIndicator.vue'


//* Props *//
interface Props {
    deviceId: string,
    label: string,
    active: boolean
}
const props = withDefaults(
    defineProps<Props>(),
    {
        label: '',
        active: false,
    }
) 
/* Data */
const stream = ref<MediaStream | null>(null)

/* Computed */
const showIndicator = computed(() => {
    return !!stream.value
})

/* Methods */
const getVolumeLevel = async () => {
    stream.value = await navigator.mediaDevices.getUserMedia({
        audio: {
            deviceId: props.deviceId,
        },
    })
}

/* Mounted */
onMounted(() => {
    getVolumeLevel()
})

</script>

<style scoped lang="scss">
.no-stream-area {
  width: 40px;
}
.option-label {
  width: 260px;
  color: var(--default-text);
}
</style>

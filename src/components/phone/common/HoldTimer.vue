<template>
    <div class="hold-duration-wrapper h-4 w-8 flex items-center justify-center px-1">
        <span class="hold-duration text-inactive-text font-medium">
            {{ callHoldTime }}
        </span>
    </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useRafFn } from '@vueuse/core'
import { differenceInSeconds } from 'date-fns'

type Props = {
    putOnHoldTimestamp: number,
}
const props = defineProps<Props>()

const callHoldTime = ref('0:00')

const setTimerValue = () => {
    const now = new Date().getTime()
    const diffSeconds = differenceInSeconds(now, props.putOnHoldTimestamp)

    // Format
    const minutes = Math.floor(diffSeconds / 60)
    const seconds = diffSeconds % 60
    callHoldTime.value = `${minutes}:${seconds.toString().padStart(2, '0')}`
}


const { pause, resume } = useRafFn(setTimerValue)

// watch the prop
watch(
    () => props.putOnHoldTimestamp,
    (newTimestamp) => {
        if (newTimestamp > 0) {
            resume()
        } else {
            pause()
            callHoldTime.value = '0:00'
        }
    },
    { immediate: true }
)
</script>

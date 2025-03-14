<template>
    <div class="active-call-block-wrapper text-center">
        <div
            v-if="callAddingInProgress"
            class="calling-status text-sm font-medium mb-3 h-4"
        >
            calling
        </div>
        <div
            v-else
            class="flex items-center justify-center mb-1 h-4"
        >
<!--           <AudioQualityIndicator :call-id="id" />-->
            <div
                class="call-duration text-sm font-medium"
            >
                {{ callDuration }}
            </div>
        </div>
        <div class="caller-name truncate font-bold mb-1 text-lg">
            {{ nameValue }}
        </div>
        <div class="caller-phone text-secondary truncate text-base  font-medium">
            {{ phoneValue }}
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useVsipInject } from '@/composables/phone/useVsipProvideInject.ts'
//import AudioQualityIndicator from '@/ui/phoneDialer/components/webRtcPhone/dialPad/mainBlock/AudioQualityIndicator.vue'
import { callTime, callAddingInProgress } from '@/composables/opensipsjs'

/* Data */
const { callersData } = useVsipInject()

//* Props *//
interface Props {
    id: string
}
const props = defineProps<Props>()

/* Computed */
const callDuration = computed(() => {
    const user = callTime.value[props.id]
    return user ? user.formatted  : ''
})

const nameValue = computed(() => {
    const user = callersData.value[props.id]
    return user ? user.userName || user.userPhone : ''
})

const phoneValue = computed(() => {
    const user = callersData.value[props.id]
    return user && user.userName? user.userPhone : 'unknown'
})
</script>
<style scoped lang="scss">
.active-call-block-wrapper {
  .calling-status {
    color: var(--default-text)
  }
  .caller-name {
    color: color-mix(in srgb, var(--default-text) 60%, var(--actions-mix-color));
  }
  .caller-phone {
    letter-spacing: 0.9px
  }

  .call-duration {
    color: var(--inactive-text);
  }
}
</style>

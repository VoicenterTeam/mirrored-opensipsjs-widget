<template>
    <div class="active-call-block-wrapper text-center">
        <div
            v-if="callAddingInProgress"
            class="calling-status text-sm font-medium mb-3 h-4"
        >
            {{ getTranslation('audio.calling') }}
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
            {{ displayName }}
        </div>
        <div class="caller-phone text-secondary truncate text-base  font-medium">
            {{ displayNumber }}
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
//import AudioQualityIndicator from '@/ui/phoneDialer/components/webRtcPhone/dialPad/mainBlock/AudioQualityIndicator.vue'
import { callTime, callAddingInProgress } from '@/composables/opensipsjs'
import { getTranslation } from '@/plugins/translator'
import { ICall } from 'opensips-js-vue'
import useCallInfo from '@/composables/useCallInfo.ts'

//* Props *//
interface Props {
    call: ICall
}
const props = defineProps<Props>()

/* Composable */
const { displayName, displayNumber } = useCallInfo(props.call)

/* Computed */
const callDuration = computed(() => {
    const user = callTime.value[props.call._id]

    return user ? user.formatted  : ''
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

<template>
    <div
        ref="activeCallBlockRef"
        class="active-call-block-wrapper text-center"
        :class="{ 'is-xs': isXsLayout }"
    >
        <div
            v-if="callAddingInProgress"
            class="calling-status font-medium"
            :class="isXsLayout ? 'text-xs mb-0 h-4' : 'text-sm mb-2 h-4'"
        >
            {{ getTranslation('audio.calling') }}
        </div>
        <div v-if="callDuration"
            class="flex items-center justify-center"
            :class="isXsLayout ? 'mb-0 h-4' : 'mb-1 h-4'"
        >
            <!--           <AudioQualityIndicator :call-id="id" />-->
            <div
                class="call-duration font-medium"
                :class="isXsLayout ? 'text-xs' : 'text-sm'"
            >
                {{ callDuration }}
            </div>
        </div>
        <div
            class="caller-name truncate font-bold"
            :class="isXsLayout ? 'mb-0 text-sm leading-tight' : 'mb-1 text-lg'"
        >
            {{ displayName }}
        </div>
        <div
            class="caller-phone text-secondary truncate font-medium"
            :class="isXsLayout ? 'text-xs leading-tight' : 'text-base'"
        >
            {{ displayNumber }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
//import AudioQualityIndicator from '@/ui/phoneDialer/components/webRtcPhone/dialPad/mainBlock/AudioQualityIndicator.vue'
import { useOpenSIPSJS } from '@/composables/opensipsjs'
import { useMainWrapperHeight } from '@/composables/phone/useMainWrapperHeight'
import { getTranslation } from '@/plugins/translator'
import { ICall } from 'opensips-js-vue'
import useCallInfo from '@/composables/useCallInfo.ts'

const { getAudioState } = useOpenSIPSJS()

const { callTime, callAddingInProgress } = getAudioState()

//* Props *//
interface Props {
    call: ICall
}
const props = defineProps<Props>()

/* Composable */
const { displayName, displayNumber } = useCallInfo(props.call)

const activeCallBlockRef = ref<HTMLElement | null>(null)
const { isXsLayout } = useMainWrapperHeight(activeCallBlockRef)

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

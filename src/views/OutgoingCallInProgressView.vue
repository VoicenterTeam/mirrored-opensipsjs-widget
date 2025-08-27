<template>
    <div class="flex justify-evenly min-h-[32px] items-center px-2 text-main-text bg-primary-bg">
        <span>{{ getTranslation('audio.dialing') }} {{ maskedNumber }}...</span>
        <IncomingCallActionButton
            color="danger"
            hover-color="additional-danger-bg"
            :icon="DeclineIcon"
            size="lg"
            @click="declineOutgoingCall"
        />
    </div>
</template>

<script lang="ts" setup>
import DeclineIcon from '@/assets/icons/decline.svg?component'
import IncomingCallActionButton from '@/components/base/IncomingCallActionButton.vue'
import { computed } from 'vue'
import { getCallerNumber } from '@/helpers/callerHelper'
import { displayCallerInfoIdMask } from '@/composables/useWidgetConfig'
import { getTranslation } from '@/plugins/translator'

const props = withDefaults(
    defineProps<{
        number?: string
    }>(),
    {
        number: ''
    }
)

const emit = defineEmits<{
    (e: 'hangup'): void
}>()

const maskedNumber = computed(() => {
    return getCallerNumber(props.number, displayCallerInfoIdMask.value)
})

const declineOutgoingCall = () => {
    emit('hangup')
}

</script>

<style scoped>

</style>

<template>
    <div className="flex justify-evenly min-h-[32px] items-center px-2 text-main-text bg-primary-bg">
        <span>{{ getTranslation('audio.dialing') }} {{ displayNumber }}...</span>
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
import { getTranslation } from '@/plugins/translator'
import { ICall } from 'opensips-js-vue'
import useCallInfo from '@/composables/useCallInfo.ts'

const props = defineProps<{
    call: ICall
}>()

const emit = defineEmits<{
    (e: 'hangup'): void
}>()

const { displayNumber } = useCallInfo(props.call)

const declineOutgoingCall = () => {
    emit('hangup')
}
</script>

<style scoped>

</style>

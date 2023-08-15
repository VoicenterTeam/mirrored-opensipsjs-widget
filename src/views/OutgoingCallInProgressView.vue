<template>
    <div className="flex justify-evenly min-h-[32px] items-center px-2 bg-primary-bg">
        <span>Calling...</span>
        <IncomingCallActionButton
            color="danger"
            hover-color="additional-danger-bg"
            :icon="DeclineIcon"
            size="lg"
            additional-classes=""
            @click="declineOutgoingCall" />
    </div>
</template>

<script lang="ts" setup>
import DeclineIcon from '@/assets/icons/decline.svg?component'
import IncomingCallActionButton from '@/components/base/IncomingCallActionButton.vue'

const emit = defineEmits<{
    (e: 'hangup'): void
}>()

const declineOutgoingCall = () => {
    emit('hangup')
}

</script>

<style scoped>

</style>

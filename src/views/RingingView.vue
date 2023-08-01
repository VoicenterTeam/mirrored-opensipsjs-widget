<template>
    <div className="flex min-h-[60px] justify-around items-center">
        <div>
            {{ number }}
        </div>
        <div>
            <IncomingCallActionButton
                color="success"
                hover-color="additional-success-bg"
                :icon="CallIcon"
                size="xxl"
                @click="answerCall" />
            <IncomingCallActionButton
                color="danger"
                hover-color="additional-danger-bg"
                :icon="DeclineIcon"
                size="xxl"
                additional-classes=""
                @click="declineCall" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import CallIcon from '@/assets/icons/call.svg?component'
import DeclineIcon from '@/assets/icons/decline.svg?component'
import IncomingCallActionButton from '@/components/base/IncomingCallActionButton.vue'

const props = withDefaults(
    defineProps<{
        number: string
    }>(),
    {}
)

const answerCall = () => {
    console.log('answer', props.number)
}

const declineCall = () => {
    console.log('decline', props.number)
}

</script>

<style scoped>

</style>

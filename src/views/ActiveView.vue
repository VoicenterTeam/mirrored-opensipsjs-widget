<template>
    <div className="min-h-[60px] min-w-[354px]">
        <RingingView v-if="incomingUnansweredCall" :call="incomingUnansweredCall" />
        <ActiveCallView v-if="incomingAnsweredCall" :call="incomingAnsweredCall" />
        <div v-if="!isAnyActiveCall">
            <div className="flex min-h-[32px] justify-center items-center">
                <VoicenterIcon />
            </div>
        </div>
        <ActionButtons />
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import ActionButtons from '@/components/ActionButtons.vue'
import VoicenterIcon from '@/assets/icons/voicenter.svg?component'
import RingingView from '@/views/RingingView.vue'
import ActiveCallView from '@/components/views/active/ActiveCallView.vue'

import { allActiveCalls } from '@/composables/opensipsjs'


const isAnyActiveCall = computed(() => {
    return Object.values(allActiveCalls.value).length > 0
})

const incomingUnansweredCall = computed(() => {
    const incomingCallObject = Object.values(allActiveCalls.value).find((call) => {
        return call.direction === 'incoming' && !call._is_confirmed && !call._is_canceled
    })

    return incomingCallObject
})

const incomingAnsweredCall = computed(() => {
    const incomingCallObject = Object.values(allActiveCalls.value).find((call) => {
        return call.direction === 'incoming' && call._is_confirmed
    })

    console.log('incomingAnsweredCall', incomingCallObject)
    return incomingCallObject
})

</script>

<style scoped>

</style>

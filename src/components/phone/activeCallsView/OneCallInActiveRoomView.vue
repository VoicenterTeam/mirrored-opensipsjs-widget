<template>
    <CallsCompactView
        v-if="roomsWithoutActive.length"
        :rooms-length="activeRoomsWithoutIncoming.length"
        :calls-length="lengthOfCallsWithoutIncoming"
    />
    <ActiveCallBlock
        :call="oneActiveCall"
        class="py-2 px-3"
    />
    <OneCallControlButtonsBlock
        class="px-5"
    />
</template>
<script setup lang="ts">
import { computed } from 'vue'
import CallsCompactView from '@/components/phone/common/CallsCompactView.vue'
import ActiveCallBlock from '@/components/phone/activeCallsView/ActiveCallBlock.vue'
import OneCallControlButtonsBlock from '@/components/phone/activeCallsView/OneCallControlButtonsBlock.vue'
import { useVsipInject } from '@/composables/phone/useVsipProvideInject.ts'

/* Data */
const { callsInActiveRoom, roomsWithoutActive , activeRoomsWithoutIncoming, lengthOfCallsWithoutIncoming } = useVsipInject()

/* Computed */
const oneActiveCall = computed(() => {
    return callsInActiveRoom.value[0]
})
</script>

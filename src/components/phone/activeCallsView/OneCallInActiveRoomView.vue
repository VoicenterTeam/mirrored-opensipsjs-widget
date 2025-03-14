<template>
    <CallsCompactView
        v-if="roomsWithoutActive.length"
        :rooms-length="activeRoomsWithoutIncoming.length"
        :calls-length="lengthOfCallsWithoutIncoming"
    />
    <ActiveCallBlock
        :id="oneActiveCallId"
        class="py-2 px-3"
    />
    <OneCallControlButtonsBlock
        class="px-5 m-auto"
    />
</template>
<script setup lang="ts">
import { computed } from 'vue'
import CallsCompactView from '@/components/phone/common/CallsCompactView.vue'
import ActiveCallBlock from '@/components/phone/activeCallsView/ActiveCallBlock.vue'
import OneCallControlButtonsBlock from '@/components/phone/activeCallsView/OneCallControlButtonsBlock.vue'
import { useVsipInject } from '@/composables/phone/useVsipProvideInject.ts'


/* Data */
const { callsInActiveRoom, roomsWithoutActive , activeRoomsWithoutIncoming, lengthOfCallsWithoutIncoming} = useVsipInject()

/* Computed */
const oneActiveCallId = computed(() => {
    return callsInActiveRoom.value[0]._id
})
</script>

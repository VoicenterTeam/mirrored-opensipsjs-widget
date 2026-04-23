<template>
    <div
        ref="oneCallViewRef"
        class="flex flex-col min-h-0"
        :class="{ 'flex-1': !isXsLayout }"
    >
        <CallsCompactView
            v-if="roomsWithoutActive.length"
            :rooms-length="activeRoomsWithoutIncoming.length"
            :calls-length="lengthOfCallsWithoutIncoming"
        />
        <ActiveCallBlock
            :call="oneActiveCall"
            class="px-3"
            :class="isXsLayout ? 'pt-0 pb-1' : 'py-2'"
        />
        <OneCallControlButtonsBlock class="px-5" />
    </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import CallsCompactView from '@/components/phone/common/CallsCompactView.vue'
import ActiveCallBlock from '@/components/phone/activeCallsView/ActiveCallBlock.vue'
import OneCallControlButtonsBlock from '@/components/phone/activeCallsView/OneCallControlButtonsBlock.vue'
import { useOpenSIPSJS } from '@/composables/opensipsjs'
import { useMainWrapperHeight } from '@/composables/phone/useMainWrapperHeight'

const { getAudioState } = useOpenSIPSJS()
const {
    callsInActiveRoom,
    activeRoomsWithoutIncoming,
    roomsWithoutActive,
    lengthOfCallsWithoutIncoming
} = getAudioState()

const oneCallViewRef = ref<HTMLElement | null>(null)
const { isXsLayout } = useMainWrapperHeight(oneCallViewRef)

/* Computed */
const oneActiveCall = computed(() => {
    return callsInActiveRoom.value[0]
})
</script>

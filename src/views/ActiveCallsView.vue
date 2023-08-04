<template>
    <div className="flex items-end">
        <div>
            <div v-for="room in roomsList" :key="room.roomId">
                <div>
                    <RoomButton :room-id="room.roomId" :is-active="room.roomId === currentActiveRoom" />
                </div>
            </div>
        </div>

        <div>
            <div v-for="(call, index) in callsInActiveRoom" :key="call._id">
                <ActiveCallView
                    :call="call"
                    :is-single-room="roomsList.length === 1"
                    :is-single-call="callsInActiveRoom.length === 1"
                    :is-first-caller="index === 0"
                    @transfer-click="onTransferClick"
                    @move-click="onMoveClick"
                />
            </div>
        </div>

    </div>
</template>

<script lang="ts" setup>
import type { UnwrapRef } from 'vue'
import { computed, ref } from 'vue'
import type { ICall, IRoom } from '@voicenter-team/opensips-js/src/types/rtc'
import ActionButtons from '@/components/ActionButtons.vue'
import VoicenterIcon from '@/assets/icons/voicenter.svg?component'
import TransferView from '@/views/TransferView.vue'
import RingingView from '@/views/RingingView.vue'
import ActiveCallView from '@/components/views/active/ActiveCallView.vue'
import { allowShrinkOnIdle } from '@/composables/useCallSettingsPermissions'
import { allActiveCalls, allRooms, currentActiveRoom, useOpenSIPSJS } from '@/composables/opensipsjs'
import RoomButton from '@/components/views/active/RoomButton.vue'

const props = withDefaults(
    defineProps<{
        calls: UnwrapRef<Array<ICall>>
    }>(),
    {}
)

const roomsList = computed(() => {
    const rooms: Array<IRoom> = Object.values(allRooms.value)
    console.log('roomsList', rooms)
    return rooms
})

const callsInActiveRoom = computed(() => {
    const cls = props.calls.filter(call => {
        return call.roomId === currentActiveRoom.value
    })
    console.log('callsInActiveRoom', cls)
    return cls
})

const emit = defineEmits<{
    (e: 'transfer-click', callId: string): void
    (e: 'move-click', callId: string): void
}>()

const getCallsInRoom = (roomId: number) => {
    const cls = props.calls.filter(call => {
        return call.roomId === roomId
    })
    console.log('callsInRoom', cls)
    return cls
}
const getFirstCallInInactiveRoom = (roomId: number) => {
    const call = props.calls.find((call) => call.roomId === roomId)
    return `${call?._remote_identity._uri._user} in ${call?.roomId}`
}
const onTransferClick = (callId: string) => {
    emit('transfer-click', callId)
}

const onMoveClick = (callId: string) => {
    emit('move-click', callId)
}
</script>

<style scoped>

</style>

<template>
    <div>
        <div
            v-if="showCallInfoBlock"
            class="flex justify-between p-1 pl-2"
            style="box-shadow: 0 1px 5px -3px gray"
        >
            <div class="font-semibold">
                {{ callsInActiveRoom.length }} participants
            </div>

            <div class="flex">
                <div class="ml-1">
                    <AddCallerButton @toggle-keypad="onToggleAddCallerKeypad" />
                </div>

                <div
                    v-if="allRooms.length > 1"
                    class="ml-1"
                >
                    <RoomActionButton
                        icon="vc-lc-arrow-right-left"
                        label="SWITCH"
                        @click="onSwitchRoomButtonClick"
                    />
                </div>
            </div>
        </div>

        <div
            v-if="showRoomInfoBlock"
            class="flex justify-between p-1 pl-2"
            style="box-shadow: 0 1px 5px -2px gray;"
        >
            <div class="font-semibold">
                {{ allRooms.length }} rooms
            </div>

            <div class="flex">
                <div class="ml-1">
                    <RoomActionButton
                        icon="vc-lc-undo-2"
                        label="Back"
                        :disabled="!currentActiveRoom"
                        @click="onSwitchRoomButtonClick"
                    />
                </div>
            </div>
        </div>

        <div v-if="isRoomListView">
            <div
                v-for="(room, index) in activeRooms"
                :key="room.roomId"
                :class="{'list-item': activeRooms.length > 1}"
            >
                <SwitchRoomListItem
                    :room-id="room.roomId"
                    :is-active="room.isActive"
                    :identifier="room.identifier"
                    :oldest-call-id="room.oldestCallId"
                    @switch-room="onSetActiveRoom(room.roomId)"
                    @exit-room="onExitRoom"
                />
            </div>
        </div>
        <div v-else>
            <div
                v-for="(call, index) in callsInActiveRoom"
                :key="call._id"
                className="flex w-full"
                :class="{'list-item': callsInActiveRoom.length > 1}"
            >
                <CallView
                    :call="call"
                    :is-single-room="allRooms.length === 1"
                    :is-single-call="callsInActiveRoom.length === 1"
                    :is-first-caller="index === 0"
                    @transfer-click="onTransferClick"
                    @move-click="onMoveClick"
                    @terminate-call="onCallTerminate"
                    @toggle-keypad="onToggleAddCallerKeypad"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { UnwrapRef } from 'vue'
import { ref, computed } from 'vue'
import type { ICall } from 'opensips-js/src/types/rtc'
import CallView from '@/components/CallView.vue'
import { useOpenSIPSJS, allRooms, allActiveCalls, currentActiveRoom } from '@/composables/opensipsjs'
import useCallInfo from '@/composables/useCallInfo'
import AddCallerButton from '@/components/AddCallerButton.vue'
import RoomActionButton from '@/components/base/RoomActionButton.vue'
import SwitchRoomListItem from '@/components/SwitchRoomListItem.vue'

const { terminateCall, setActiveRoom } = useOpenSIPSJS()

withDefaults(
    defineProps<{
        calls: UnwrapRef<Array<ICall>>
    }>(),
    {}
)

const isRoomListView = ref(false)

const callsInActiveRoom = computed(() => {
    return allActiveCalls.value.filter((call) => {
        return call.roomId === currentActiveRoom.value
    })
})

const showCallInfoBlock = computed(() => {
    return allRooms.value.length > 1 && !isRoomListView.value
})

const showRoomInfoBlock = computed(() => {
    return allRooms.value.length > 0 && isRoomListView.value
})

const activeRooms = computed(() => {
    return allRooms.value.map((room) => {
        const callsInRoom = allActiveCalls.value.filter((call) => {
            return call.roomId === room.roomId
        })

        let singleParticipantName = ''

        if (callsInRoom.length === 1) {
            const { displayNumber } = useCallInfo(callsInRoom[0])
            singleParticipantName = displayNumber.value
        }

        const oldestCall = callsInRoom.sort((call_1, call_2) => {
            const call1StartTime = new Date(call_1.start_time)
            const call2StartTime = new Date(call_2.start_time)

            return call1StartTime.getTime() - call2StartTime.getTime()
        })

        return {
            roomId: room.roomId,
            isActive: room.roomId === currentActiveRoom.value,
            identifier: callsInRoom.length > 1 ? `${callsInRoom.length} participants` : singleParticipantName,
            oldestCallId: oldestCall[0]._id
        }
    })
})


const emit = defineEmits<{
    (e: 'transfer-click', callId: string): void
    (e: 'move-click', callId: string): void
    (e: 'toggle-keypad'): void
}>()

function onToggleAddCallerKeypad () {
    emit('toggle-keypad')
}

function onSetActiveRoom (roomId: number) {
    setActiveRoom(roomId)
    isRoomListView.value = false
}

function onExitRoom () {
    setActiveRoom(undefined)
}

function onSwitchRoomButtonClick () {
    isRoomListView.value = !isRoomListView.value
}

const onTransferClick = (callId: string) => {
    emit('transfer-click', callId)
}

const onMoveClick = (callId: string) => {
    emit('move-click', callId)
}

function onCallTerminate () {
    console.log('onTerminate')
    isRoomListView.value = true
}

function switchRoomListView (value: boolean) {
    isRoomListView.value = value
}

defineExpose({
    switchRoomListView
})

</script>

<style scoped>
.list-item:nth-child(odd) {
  @apply bg-primary-actions-bg--focus;
}
</style>

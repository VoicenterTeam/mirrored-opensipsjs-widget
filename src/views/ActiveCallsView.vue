<template>
    <div>
        <div
            v-if="showCallInfoBlock"
            class="flex justify-between p-1 pl-2"
            style="box-shadow: 0 1px 5px -3px gray"
        >
            <div class="font-semibold">
                {{ callsInActiveRoom.length }} {{ getTranslation('audio.room.view.participants') }}
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
                        :label="getTranslation('audio.room.switch').toUpperCase()"
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
                {{ allRooms.length }} {{ getTranslation('audio.room.view.rooms') }}
            </div>

            <div class="flex">
                <div class="ml-1">
                    <RoomActionButton
                        icon="vc-lc-undo-2"
                        :label="getTranslation('audio.back')"
                        :disabled="!currentActiveRoom"
                        @click="onSwitchRoomButtonClick"
                    />
                </div>
            </div>
        </div>

        <div v-if="isRoomListView">
            <div
                v-for="(room) in allRooms"
                :key="room.roomId"
                :class="{'list-item': allRooms.length > 1}"
            >
                <SwitchRoomListItem
                    :room-id="room.roomId"
                    @switch-room="onSetActiveRoom(room.roomId)"
                    @exit-room="onExitRoom"
                />
            </div>
        </div>

        <div v-else>
            <div
                v-for="(call, index) in callsInActiveRoom"
                :key="call._id"
                class="flex w-full"
                :class="{'list-item': callsInActiveRoom.length > 1}"
            >
                <CallView
                    :call="call"
                    :is-single-room="allRooms.length === 1"
                    :is-single-call="callsInActiveRoom.length === 1"
                    :is-first-caller="index === 0"
                    @transfer-click="onTransferClick(call)"
                    @move-click="onMoveClick(call)"
                    @terminate-call="onCallTerminate"
                    @toggle-keypad="onToggleAddCallerKeypad"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { UnwrapRef, watch } from 'vue'
import { ref, computed } from 'vue'
import type { ICall } from 'opensips-js/src/types/rtc'
import CallView from '@/components/CallView.vue'
import { useOpenSIPSJS } from '@/composables/opensipsjs'
import AddCallerButton from '@/components/AddCallerButton.vue'
import RoomActionButton from '@/components/base/RoomActionButton.vue'
import SwitchRoomListItem from '@/components/SwitchRoomListItem.vue'
import { getTranslation } from '@/plugins/translator'

const { getAudioState, getAudioApi } = useOpenSIPSJS()
const { setActiveRoom } = getAudioApi()

const { allRooms, allActiveCalls, currentActiveRoom } = getAudioState()

defineProps<{
    calls: UnwrapRef<Array<ICall>>
}>()

const emit = defineEmits<{
    (e: 'transfer-click', call: ICall): void
    (e: 'move-click', call: ICall): void
    (e: 'toggle-keypad'): void
}>()

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

const onTransferClick = (call: ICall) => {
    emit('transfer-click', call)
}

const onMoveClick = (call: ICall) => {
    emit('move-click', call)
}

function onCallTerminate () {
    if (callsInActiveRoom.value.length === 0) {
        isRoomListView.value = true
    }
}

function switchRoomListView (value: boolean) {
    isRoomListView.value = value
}

watch(allActiveCalls, (data) => {
    if (data.length === 0) {
        isRoomListView.value = false
    }
})

defineExpose({
    switchRoomListView
})
</script>

<style scoped>
.list-item:nth-child(odd) {
  @apply bg-primary-actions-bg--focus;
}
</style>

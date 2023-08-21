<template>
    <div className="flex items-end bg-primary-bg">
        <div v-if="allRooms.length > 1 || !currentActiveRoom" className="flex flex-col-reverse">
            <div v-for="(room, index) in allRooms" :key="room.roomId">
                <div>
                    <RoomButton
                        :room-id="room.roomId"
                        :is-active="room.roomId === currentActiveRoom"
                        :is-with-border="index < callsInActiveRoom.length"
                        :is-multi-call-mode="allRooms.length > 1 || callsInActiveRoom.length > 1"
                    />
                </div>
            </div>
        </div>

        <div className="flex w-full">
            <div v-for="(call, index) in callsInActiveRoom" :key="call._id" className="flex w-full">
                <ActiveCallView
                    :call="call"
                    :is-single-room="allRooms.length === 1"
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
import { computed } from 'vue'
import type { ICall } from '@voicenter-team/opensips-js/src/types/rtc'
import ActiveCallView from '@/components/views/active/ActiveCallView.vue'
import { allRooms, currentActiveRoom } from '@/composables/opensipsjs'
import RoomButton from '@/components/views/active/RoomButton.vue'

const props = withDefaults(
    defineProps<{
        calls: UnwrapRef<Array<ICall>>
    }>(),
    {}
)

const callsInActiveRoom = computed(() => {
    const cls = props.calls.filter(call => {
        return call.roomId === currentActiveRoom.value
    })
    return cls
})

const emit = defineEmits<{
    (e: 'transfer-click', callId: string): void
    (e: 'move-click', callId: string): void
}>()

const onTransferClick = (callId: string) => {
    emit('transfer-click', callId)
}

const onMoveClick = (callId: string) => {
    emit('move-click', callId)
}
</script>

<style scoped>

</style>

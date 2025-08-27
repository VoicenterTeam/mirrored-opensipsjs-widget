<template>
    <div class="flex justify-between items-center h-10 p-1">
        <div class="flex">
            <OptionActionButton
                v-if="isActive"
                icon="vc-lc-circle-pause"
                size="2xl"
                @click="onExitRoom"
            />
            <OptionActionButton
                v-else
                icon="vc-lc-log-in"
                size="2xl"
                @click="onSwitchRoom"
            />
            <div
                class="pl-2 truncate"
                style="max-width: 200px;"
            >
                {{ roomTitle }}
            </div>
        </div>

        <div class="flex">
            <div class="flex items-center mx-2 w-[46px]">
                <span class="text-xs text-main-text">
                    {{ roomDuration }}
                </span>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import OptionActionButton from '@/components/base/OptionActionButton.vue'
import { useRoomData } from '@/composables/phone/useRoomData.ts'

const props = defineProps<{
    roomId: number
}>()

const emit = defineEmits<{
    (e: 'transfer-click', callId: string): void
    (e: 'move-click', callId: string): void
    (e: 'open-room-list'): void
    (e: 'switch-room'): void
    (e: 'exit-room'): void
}>()

const { roomDuration, roomTitle, isActive } = useRoomData(props.roomId)

function onExitRoom () {
    emit('exit-room')
}

function onSwitchRoom () {
    emit('switch-room')
}
</script>

<style scoped>

</style>

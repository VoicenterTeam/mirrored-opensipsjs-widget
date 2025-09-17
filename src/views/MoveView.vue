<template>
    <div class="p-1">
        <div class="flex items-center mb-1">
            <div>
                <ActionIconButton
                    icon="vc-lc-arrow-left"
                    color="primary-actions"
                    bg-color="inactive-elements-bg--focus"
                    size="sm"
                    rounded
                    @click="cancelMoving"
                />
            </div>
            <div class="w-full ml-2">
                <div class="text-xs text-inactive-text font-semibold">
                    {{ getTranslation('audio.move').toUpperCase() }}
                </div>
                <div
                    class="flex text-sm text-main-text font-medium"
                    style="width: 300px; max-width: 300px;"
                >
                    <span
                        v-if="displayCallerInfoName && movingCallerName"
                        class="w-1/2 max-w-1/2 truncate"
                    >
                        {{ movingCallerName }}
                    </span>
                    <span
                        v-if="displayCallerInfoId && movingCallerNumber"
                        class="w-1/2 max-w-1/2 truncate"
                    >
                        {{ movingCallerNumber }}
                    </span>
                </div>
            </div>
        </div>

        <div class="flex w-full">
            <div
                style="width: 140px;"
                class="room-select_wrapper"
            >
                <VcSelect
                    v-model="target"
                    :teleported="false"
                    placement="top"
                    class="static"
                    :options="roomSelectOptions"
                    :config="{ labelKey: 'label', valueKey: 'value' }"
                    placeholder="Select Room"
                />
            </div>
            <div class="ml-1">
                <ActionIconButton
                    icon="vc-lc-arrow-down-up"
                    bg-color="primary-actions-bg--focus"
                    color="primary"
                    @click="doMove"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import type { ICall } from 'opensips-js/src/types/rtc'
import { useOpenSIPSJS } from '@/composables/opensipsjs'
import {
    displayCallerInfoId,
    displayCallerInfoName
} from '@/composables/useWidgetConfig'
import useCallInfo from '@/composables/useCallInfo'
import { getTranslation } from '@/plugins/translator'
import ActionIconButton from '@/components/base/ActionIconButton.vue'
import { VcSelect } from '@voicenter-team/voicenter-ui-plus'
import { getCallsInRoom, getRoomTitleCombined } from '@/helpers/roomHelper.ts'

const { getAudioState } = useOpenSIPSJS()

const { allActiveCalls, allRooms } = getAudioState()

/* Types */
type RoomOption = {
    value: number
    label: string
}

/* Props */
const props = defineProps<{
    call: ICall
}>()

/* Emit */
const emit = defineEmits<{
    (e: 'move', roomId: number): void
    (e: 'cancel'): void
}>()

/* Composable */
const { displayNumber: movingCallerNumber, displayName: movingCallerName } = useCallInfo(props.call)

/* Data */
const target = ref<number | undefined>()
const roomSelectOptions = ref<Array<RoomOption>>([])

/* Methods */
function doMove () {
    if (!target.value) {
        return
    }

    emit('move', Number(target.value))
}
const cancelMoving = () => {
    emit('cancel')
}

/* Watchers */
watch(
    [ allRooms, allActiveCalls ],
    async ([ rooms, calls ]) => {
        // Filter out current room and create promises for each room
        const roomPromises = rooms
            .filter(room => room.roomId !== props.call.roomId)
            .map(async (room) => {
                const roomTitle = await getRoomTitleCombined(getCallsInRoom(room.roomId, calls))
                return {
                    value: room.roomId,
                    label: roomTitle
                }
            })

        // Wait for all promises to resolve
        roomSelectOptions.value = await Promise.all(roomPromises)
    },
    {
        immediate: true
    }
)
</script>

<style scoped>
.room-select_wrapper {
  @apply rounded p-0.5;
}

.room-select_wrapper select {
  @apply w-full h-full border border-border-lines rounded;
}

.room-select_wrapper select:focus {
  @apply outline-none ring-0;
}

.room-select_wrapper :deep(.el-select-dropdown .el-select-dropdown__item .vc-select__option-content) {
  @apply block max-w-64 truncate;
}
</style>

import { computed, ref, watch } from 'vue'
import { useOpenSIPSJS } from '@/composables/opensipsjs'
import {
    getCallsInRoom,
    getOldestCall,
    getRoomDuration,
    getRoomTitle,
    getRoomTitleCombined
} from '@/helpers/roomHelper.ts'
const { getAudioState } = useOpenSIPSJS()
const { allActiveCalls, callTime, currentActiveRoom } = getAudioState()

export function useRoomData (roomId: number) {
    /* Data */
    const _roomTitle = ref('')
    const _roomTitleCombined = ref('')

    /* Computed */
    const callsInRoom = computed(() => {
        return getCallsInRoom(roomId, allActiveCalls.value)
    })
    const oldestCall = computed(() => {
        return getOldestCall(callsInRoom.value)
    })
    const isActive = computed(() => {
        return currentActiveRoom.value === roomId
    })
    const roomDuration = computed(() => {
        return getRoomDuration(callTime.value, callsInRoom.value)
    })
    const roomTitle = computed(() => _roomTitle.value)
    const roomTitleCombined = computed(() => _roomTitleCombined.value)

    /* Watch */
    watch(
        callsInRoom,
        async (newCalls) => {
            _roomTitle.value = await getRoomTitle(newCalls)
            _roomTitleCombined.value = await getRoomTitleCombined(newCalls)
        },
        {
            immediate: true
        }
    )

    return {
        callsInRoom,
        oldestCall,
        isActive,
        roomDuration,
        roomTitle,
        roomTitleCombined
    }
}

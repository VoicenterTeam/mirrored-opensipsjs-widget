import { useVsipInject } from '@/composables/phone/useVsipProvideInject.ts'
import type { ICall } from 'opensips-js/src/types/rtc'
import { callTime } from '@/composables/opensipsjs'

export const useRoomData = () => {

    /* Data */
    const { callersData, getActiveCallsInRoom } = useVsipInject()

    /* Methods */

    const getRoomTitle = (calls:  ICall[]) => {
        if (calls.length === 1) {
            const caller = callersData.value[calls[0]._id]
            return caller ? (caller.userName || caller.userPhone || '') : ''
        }
        return `${calls.length} callers`
    }

    const getFirstCallIdInRoom = (roomId: number) => {
        const callsInRoom = getActiveCallsInRoom(roomId)
        const firstCall = findFirstCallByTime(callsInRoom)
        return firstCall._id

    }

    const findFirstCallByTime = (callsInRoom: ICall[]) => {
        const oldestCall = callsInRoom.reduce((oldest, current) => {
            const startTimeCurrent = new Date(current.start_time)
            const startTimeOldest = new Date(oldest.start_time)

            // Compare startTime of current call with startTime of oldest call found
            if (startTimeCurrent < startTimeOldest) {
                return current
            } else {
                return oldest
            }
        }, callsInRoom[0])
        return oldestCall
    }

    const getCaller = (roomId: number) => {
        const callsInRoom = getActiveCallsInRoom(roomId)
        return getRoomTitle(callsInRoom)

    }

    const getRoomDuration = (roomId: number) => {
        const callsInRoom = getActiveCallsInRoom(roomId)
        return getDuration(callsInRoom)
    }


    const getDuration = (calls: ICall[]) => {
        if(!calls.length) { return ''}

        const firstCall = findFirstCallByTime(calls)

        const firstCallId = firstCall._id
        return firstCallId && callTime.value[firstCallId] ? callTime.value[firstCallId].formatted : 'N/A'
    }


    return {
        getCaller,
        getRoomDuration,
        getDuration,
        findFirstCallByTime,
        getFirstCallIdInRoom,
        getRoomTitle
    }
}

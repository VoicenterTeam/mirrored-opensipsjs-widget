import { ICall } from 'opensips-js-vue'
import { ITimeData } from 'opensips-js/src/types/timer'
import { getCallDisplayInfo } from '@/helpers/callerHelper.ts'
import { getTranslation } from '@/plugins/translator.ts'

export function getCallsInRoom (roomId: number, allCalls: ICall[]): ICall[] {
    return allCalls.filter(c => c.roomId === roomId)
}

export function getOldestCall (calls: ICall[]): ICall | null {
    if (!calls.length) { return null }

    return calls.reduce(
        (oldest, current) => {
            const startTimeCurrent = new Date(current.start_time)
            const startTimeOldest = new Date(oldest.start_time)

            // Compare startTime of current call with startTime of oldest call found
            if (startTimeCurrent < startTimeOldest) {
                return current
            } else {
                return oldest
            }
        },
        calls[0]
    )
}

export function getRoomDuration (callsTime: Record<string, ITimeData>, roomCalls: ICall[]): string {
    if (!roomCalls.length) { return '' }

    const oldestCall = getOldestCall(roomCalls)

    if (!oldestCall) { return '' }

    const oldestCallId = oldestCall._id

    return oldestCallId && callsTime[oldestCallId] ? callsTime[oldestCallId].formatted : 'N/A'
}

/**
 * Returns the room title based on the number of calls in the room
 * If only one call - returns the caller resolved display name
 *
 * @param roomCalls
 */
export async function getRoomTitle (roomCalls: ICall[]): Promise<string> {
    if (!roomCalls.length) { return 'N/A' }

    if (roomCalls.length === 1) {
        return getCallDisplayInfo(roomCalls[0]).then(info => info.displayName)
    } else {
        return `${roomCalls.length} ${getTranslation('audio.callers')}`
    }
}

/**
 * Returns the room title which consist of combined all caller resolved names in the room
 * If only one call - returns the caller resolved display name
 */
export async function getRoomTitleCombined (roomCalls: ICall[]): Promise<string> {
    if (!roomCalls.length) { return 'N/A' }

    if (roomCalls.length === 1) {
        return getCallDisplayInfo(roomCalls[0]).then(info => info.displayName)
    } else {
        const displayNames = await Promise.all(
            roomCalls.map(call => getCallDisplayInfo(call).then(info => info.displayName))
        )

        return displayNames.join(', ')
    }
}

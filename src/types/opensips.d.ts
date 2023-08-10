import type { ICall, IRoom, ICallStatus } from '@voicenter-team/opensips-js/src/types/rtc'

export type DoHoldFunctionType = {
    callId: string
    toHold: boolean
    automatic?: boolean
}

export type AllActiveCallsType = { [p: string]: ICall }
export type AllActiveRoomsType = { [p: number]: IRoom }
export type AllActiveCallsStatusType = { [p: string]: ICallStatus }

export interface CallTimeType {
    [key: string]: number
}

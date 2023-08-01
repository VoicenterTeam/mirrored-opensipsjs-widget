import type { ICall } from '@voicenter-team/opensips-js/src/types/rtc'

export type DoHoldFunctionType = {
    callId: string
    toHold: boolean
    automatic?: boolean
}

export type AllActiveCallsType = { [p: string]: ICall }

export interface CallTimeType {
    [key: string]: number
}

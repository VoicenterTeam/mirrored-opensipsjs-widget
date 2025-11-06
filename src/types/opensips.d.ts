import type { ICall, IRoom, ICallStatus } from 'opensips-js/src/types/rtc'

export type AllActiveCallsType = { [p: string]: ICall }
export type AllActiveRoomsType = { [p: number]: IRoom }
export type AllActiveCallsStatusType = { [p: string]: ICallStatus }


import { InjectionKey, provide, inject, ComputedRef, Ref } from 'vue'
import type { ICall, IRoom } from '@voicenter-team/opensips-js/src/types/rtc'
import { GenericObjectType, CallUserDataType } from '@/types/phone'


type TVsipProvideParam = {
    callsInActiveRoom: ComputedRef<ICall[]>,
    activeRoomsWithoutIncoming: ComputedRef<IRoom[]>,
    lengthOfCallsWithoutIncoming: ComputedRef<number>,
    roomsWithoutActive: ComputedRef<IRoom[]>,
    callersData: Ref<GenericObjectType<CallUserDataType>>,
    getActiveCallsInRoom: (value: number) => Array<ICall>,
}

const injectionKey = Symbol() as InjectionKey<TVsipProvideParam>

export const useVsipProvide = (param: TVsipProvideParam) => {
    provide(injectionKey , param)
}

export const useVsipInject = () => {
    const injectData = inject(injectionKey)

    if (!injectData) {
        throw new Error('Entity must be provided')
    }

    const { callsInActiveRoom, roomsWithoutActive, lengthOfCallsWithoutIncoming,  activeRoomsWithoutIncoming, callersData, getActiveCallsInRoom } = injectData

    return {
        callsInActiveRoom,
        lengthOfCallsWithoutIncoming,
        activeRoomsWithoutIncoming,
        roomsWithoutActive,
        callersData,
        getActiveCallsInRoom
    }
}




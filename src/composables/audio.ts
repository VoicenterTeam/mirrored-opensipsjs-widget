import { ref, computed, watch } from 'vue'
import { ICall, vsipAPI } from 'opensips-js-vue'
import type { IRoom } from 'opensips-js/src/types/rtc'
import state from '@/composables/state'
import type { AllActiveCallsType, CallTimeType } from '@/types/opensips'

export const activeInputDevice = vsipAPI.state.selectedInputDevice
export const inputDevicesList = vsipAPI.state.inputMediaDeviceList

export const activeOutputDevice = vsipAPI.state.selectedOutputDevice
export const outputDevicesList = vsipAPI.state.outputMediaDeviceList
export const ringingDevicesList = vsipAPI.state.outputMediaDeviceList
export const activeRingingDevice = ref<string>('default')
export const microphoneInputLevel = vsipAPI.state.microphoneInputLevel

/* Calls management */
export const activeCalls = vsipAPI.state.activeCalls
export const allRooms = computed(() => {
    return Object.values(vsipAPI.state.activeRooms.value)
})
export const currentActiveRoom = vsipAPI.state.currentActiveRoomId
export const allCallStatuses = computed(() => {
    return Object.values(vsipAPI.state.callStatus.value)
})
export const callsInActiveRoom = computed(() => {
    return allActiveCalls.value.filter((call) => {
        return call.roomId === currentActiveRoom.value
    })
})
export const activeRoomsWithoutIncoming = computed(() => {
    const activeRooms: Array<IRoom> = Object.values(allRooms.value)

    return activeRooms.filter((room) => {
        return !room.incomingInProgress
    })
})
export const roomsWithoutActive = computed(() => {
    return activeRoomsWithoutIncoming.value.filter((room) => {
        return room.roomId !== currentActiveRoom.value
    })
})
export const callsExceptIncoming = computed(() => {
    const activeRoomIds = activeRoomsWithoutIncoming.value.map(room => room.roomId)
    const allActiveCalls = Object.values(activeCalls.value)
    return allActiveCalls.filter(call => call.roomId && activeRoomIds.includes(call.roomId))
})
export const lengthOfCallsWithoutIncoming = computed(() => {
    return callsExceptIncoming.value.length
})

/* Call settings */
export const isMuted = vsipAPI.state.isMuted
export const isDND =  vsipAPI.state.isDND
export const isMuteWhenJoin = vsipAPI.state.muteWhenJoin
export const originalStream = vsipAPI.state.originalStream
export const callAddingInProgress = vsipAPI.state.callAddingInProgress
export const isCallWaitingEnabled = vsipAPI.state.isCallWaitingEnabled

export const speakerVolume = vsipAPI.state.speakerVolume
export const callTime = vsipAPI.state.callTime
export const callMetrics = vsipAPI.state.callMetrics

export const muted = computed(() => {
    return Object.values(activeCalls.value).length ? isMuted.value : isMuteWhenJoin.value
})

export const allActiveCalls = computed(() => {
    return Object.values(activeCalls.value)
})

export const callTimes = ref<CallTimeType>({})

interface CallTimeIntervalsType {
    [key: string]: any
}

const callTimeIntervals = ref<CallTimeIntervalsType>({})

function updateCallTime (callId: string) {
    const prevTime = callTimes.value[callId] || 0
    callTimes.value = {
        ...callTimes.value,
        [callId]: prevTime + 1
    }
}

function removeCallTime (callId: string) {
    delete callTimes.value[callId]
}

function setCallInterval (callId: string, interval: any) {
    callTimeIntervals.value = {
        ...callTimeIntervals.value,
        [callId]: interval
    }
}
function removeOldCallTimes (calls: Array<ICall>) {
    const ids = calls.map(call => call._id)

    ids.forEach(id => {
        clearInterval(id)
        removeCallTime(id)
    })
}

function processCallsTime (calls: AllActiveCallsType, oldCalls: AllActiveCallsType) {
    const removedCalls = Object.values(oldCalls).filter(oldCall => {
        return !Object.values(calls).some(newCall => {
            return newCall._id === oldCall._id
        })
    })

    removeOldCallTimes(removedCalls)

    const newCalls = Object.values(calls).filter(call => {
        return !Object.values(oldCalls).some((existingCall) => {
            return existingCall._id === call._id
        })
    })

    if (!newCalls.length) {
        return
    }

    newCalls.forEach(call => {
        const interval = setInterval(() => updateCallTime(call._id), 1000)
        setCallInterval(call._id, interval)
    })
}

watch(speakerVolume, (newValue) => {
    state.opensipsjs?.audio.setSpeakerVolume(newValue)
})

watch(isMuteWhenJoin, (newValue) => {
    state.opensipsjs?.audio.setMuteWhenJoin(newValue)
})

watch(isDND, (newValue) => {
    state.opensipsjs?.audio.setDND(newValue)
})

watch(microphoneInputLevel, (newValue) => {
    state.opensipsjs?.audio.setMicrophoneSensitivity(newValue)
})

watch(isCallWaitingEnabled, (newValue) => {
    state.opensipsjs?.audio.setCallWaiting(newValue)
})

watch(activeCalls, (calls, oldCalls) => {
    processCallsTime(calls, oldCalls || {})
}, { deep: true })

export function getAudioState () {
    return {
        activeInputDevice,
        inputDevicesList,
        activeOutputDevice,
        outputDevicesList,
        ringingDevicesList,
        activeRingingDevice,
        microphoneInputLevel,
        activeCalls,
        allRooms,
        currentActiveRoom,
        allCallStatuses,
        callsInActiveRoom,
        activeRoomsWithoutIncoming,
        roomsWithoutActive,
        callsExceptIncoming,
        lengthOfCallsWithoutIncoming,
        isMuted,
        isDND,
        isMuteWhenJoin,
        originalStream,
        callAddingInProgress,
        isCallWaitingEnabled,
        speakerVolume,
        callTime,
        callMetrics,
        muted,
        allActiveCalls,
        callTimes
    }
}

export function getAudioApi () {
    function startCall (target: string, addToCurrentRoom = false, holdOtherCalls: boolean = false) {
        state.opensipsjs?.audio.initCall(target, addToCurrentRoom, holdOtherCalls)
    }

    function answerCall (callId: string) {
        state.opensipsjs?.audio.answerCall(callId)
    }

    function muteAgent (toMute: boolean) {
        if (toMute) {
            state.opensipsjs?.audio.mute()
        } else {
            state.opensipsjs?.audio.unmute()
        }
    }

    function mute (toMute: boolean) {
        if (Object.values(activeCalls.value).length) {
            muteAgent(toMute)
        } else {
            setMuteWhenJoin(toMute)
        }
    }

    function muteCaller (callId: string, toMute: boolean) {
        if (toMute) {
            state.opensipsjs?.audio.muteCaller(callId)
        } else {
            state.opensipsjs?.audio.unmuteCaller(callId)
        }
    }

    function holdCall (callId: string) {
        state.opensipsjs?.audio.holdCall(callId)
    }

    function unholdCall (callId: string) {
        state.opensipsjs?.audio.unholdCall(callId)
    }

    async function moveCall (callId: string, roomId: number) {
        await state.opensipsjs?.audio.moveCall(callId, roomId)
    }

    function transferCall (callId: string, target: string) {
        state.opensipsjs?.audio.transferCall(callId, target)
    }

    function mergeCallsInRoom (roomId: number) {
        state.opensipsjs?.audio.mergeCall(roomId)
    }

    function mergeCallByIds (firstCallId: string, secondCallId: string) {
        state.opensipsjs?.audio.mergeCallByIds(firstCallId, secondCallId)
    }

    function terminateCall (callId: string) {
        state.opensipsjs?.audio.terminateCall(callId)
    }

    async function setActiveRoom (roomId: number | undefined) {
        console.log('setActiveRoom', roomId)
        await state.opensipsjs?.audio.setActiveRoom(roomId)
    }

    async function setCallWaiting (value: boolean) {
        state.opensipsjs?.audio.setCallWaiting(value)
    }

    function setAutoAnswer (value: boolean) {
        state.opensipsjs?.audio.setAutoAnswer(value)
    }

    function sendDTMF (callId: string, value: string) {
        state.opensipsjs?.audio.sendDTMF(callId, value)
    }

    function setDND (value: boolean) {
        state.opensipsjs?.audio.setDND(value)
    }

    function setMuteWhenJoin (value: boolean) {
        isMuteWhenJoin.value = value
    }

    function setSpeakerVolume (value: number) {
        speakerVolume.value = value
    }

    function setMicrophoneSensitivity (value: number) {
        microphoneInputLevel.value = value
        state.opensipsjs?.audio.setMicrophoneSensitivity(value)
    }

    function getActiveCallsInRoom (roomId: number): Array<ICall> {
        const activeCallsArr = Object.values(activeCalls.value)
        return activeCallsArr.filter((call: ICall) => call.roomId === roomId)
    }

    async function onMicrophoneChange (event: Event) {
        const target = event.target as HTMLSelectElement
        await state.opensipsjs?.audio.setMicrophone(target.value)
    }

    async function onSpeakerChange (event: Event) {
        const target = event.target as HTMLSelectElement
        await state.opensipsjs?.audio.setSpeaker(target.value)
    }

    return {
        startCall,
        answerCall,
        muteAgent,
        mute,
        muteCaller,
        holdCall,
        unholdCall,
        moveCall,
        transferCall,
        mergeCallsInRoom,
        mergeCallByIds,
        setActiveRoom,
        setCallWaiting,
        terminateCall,
        setAutoAnswer,
        sendDTMF,
        setDND,
        setMuteWhenJoin,
        setSpeakerVolume,
        setMicrophoneSensitivity,
        getActiveCallsInRoom,
        onMicrophoneChange,
        onSpeakerChange
    }
}

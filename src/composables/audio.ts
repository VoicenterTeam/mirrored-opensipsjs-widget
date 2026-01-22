import { ref, computed, watch } from 'vue'
import { ICall, vsipAPI } from 'opensips-js-vue'
import type { IRoom } from 'opensips-js/src/types/rtc'
import state from '@/composables/state'
import { getLogger } from '@/plugins/logger'
import useCallSounds from '@/composables/useCallSounds'
import type { TNoiseReductionMode } from '@/types/public-api'
import { noiseReductionMode } from '@/composables/useWidgetConfig'

export const activeInputDevice = vsipAPI.state.selectedInputDevice
export const inputDevicesList = vsipAPI.state.inputMediaDeviceList

export const activeOutputDevice = vsipAPI.state.selectedOutputDevice
export const outputDevicesList = vsipAPI.state.outputMediaDeviceList
export const ringingDevicesList = vsipAPI.state.outputMediaDeviceList
export const activeRingingDevice = ref<string>('default')
export const microphoneInputLevel = vsipAPI.state.microphoneInputLevel

export const microphonePermissionAllowed = ref(false)

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
export const noiseReductionState = vsipAPI.state.noiseReductionState

export const muted = computed(() => {
    return Object.values(activeCalls.value).length ? isMuted.value : isMuteWhenJoin.value
})

export const allActiveCalls = computed(() => {
    return Object.values(activeCalls.value)
})

watch(speakerVolume, (newValue) => {
    getLogger()?.log({
        action: 'Set speaker volume',
        value: newValue
    })

    state.opensipsjs?.audio.setSpeakerVolume(newValue)
})

watch(isMuteWhenJoin, (newValue) => {
    getLogger()?.log({
        action: 'Mute when join',
        state: newValue
    })

    state.opensipsjs?.audio.setMuteWhenJoin(newValue)
})

watch(isDND, (newValue) => {
    getLogger()?.log({
        action: 'Set DND',
        state: newValue
    })

    state.opensipsjs?.audio.setDND(newValue)
})

watch(microphoneInputLevel, (newValue) => {
    getLogger()?.log({
        action: 'Set microphone sensitivity',
        value: newValue
    })

    state.opensipsjs?.audio.setMicrophoneSensitivity(newValue)
})

watch(isCallWaitingEnabled, (newValue) => {
    getLogger()?.log({
        action: 'Set call waiting',
        state: newValue
    })

    state.opensipsjs?.audio.setCallWaiting(newValue)
})

watch(noiseReductionMode, (newValue) => {
    getLogger()?.log({
        action: 'Set noise reduction mode',
        mode: newValue
    })

    state.opensipsjs?.audio.setVADConfiguration({ mode: newValue })
})

export function getAudioState () {
    return {
        activeInputDevice,
        inputDevicesList,
        activeOutputDevice,
        outputDevicesList,
        ringingDevicesList,
        activeRingingDevice,
        microphoneInputLevel,
        microphonePermissionAllowed,
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
        noiseReductionState
    }
}

export function getAudioApi () {
    const { playOnDialSound, playHangupSound, playAnswerBeepSound } = useCallSounds()

    function startCall (target: string, addToCurrentRoom = false, holdOtherCalls: boolean = false) {
        getLogger()?.log({
            action: 'Make outgoing call',
            target
        })

        playOnDialSound()
        state.opensipsjs?.audio.initCall(target, addToCurrentRoom, holdOtherCalls)
    }

    function answerCall (callId: string) {
        getLogger()?.log({
            action: 'Answer incoming call',
            call_id: callId
        })

        playAnswerBeepSound()
        state.opensipsjs?.audio.answerCall(callId)
    }

    function muteAgent (toMute: boolean) {
        getLogger()?.log({
            action: 'Mute agent',
            state: toMute
        })

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
        getLogger()?.log({
            action: 'Mute caller',
            call_id: callId,
            state: toMute,
        })

        if (toMute) {
            state.opensipsjs?.audio.muteCaller(callId)
        } else {
            state.opensipsjs?.audio.unmuteCaller(callId)
        }
    }

    function holdCall (callId: string) {
        getLogger()?.log({
            action: 'Hold call',
            call_id: callId
        })

        state.opensipsjs?.audio.holdCall(callId)
    }

    function unholdCall (callId: string) {
        getLogger()?.log({
            action: 'Unhold call',
            call_id: callId
        })

        state.opensipsjs?.audio.unholdCall(callId)
    }

    async function moveCall (callId: string, roomId: number) {
        getLogger()?.log({
            action: 'Move call',
            call_id: callId,
            to_room: roomId
        })

        await state.opensipsjs?.audio.moveCall(callId, roomId)
    }

    function transferCall (callId: string, target: string) {
        getLogger()?.log({
            action: 'Transfer call',
            call_id: callId,
            target
        })

        state.opensipsjs?.audio.transferCall(callId, target)
    }

    function mergeCallsInRoom (roomId: number) {
        getLogger()?.log({
            action: 'Merge calls in room',
            room_id: roomId
        })

        state.opensipsjs?.audio.mergeCall(roomId)
    }

    function mergeCallByIds (firstCallId: string, secondCallId: string) {
        getLogger()?.log({
            action: 'Merge calls by ids',
            first_call_id: firstCallId,
            second_call_id: secondCallId
        })

        state.opensipsjs?.audio.mergeCallByIds(firstCallId, secondCallId)
    }

    function terminateCall (callId: string) {
        getLogger()?.log({
            action: 'Terminate call',
            call_id: callId
        })

        playHangupSound()
        state.opensipsjs?.audio.terminateCall(callId)
    }

    async function setActiveRoom (roomId: number | undefined) {
        getLogger()?.log({
            action: 'Set active room',
            room_id: roomId
        })

        await state.opensipsjs?.audio.setActiveRoom(roomId)
    }

    async function setCallWaiting (value: boolean) {
        getLogger()?.log({
            action: 'Set call waiting',
            state: value
        })

        state.opensipsjs?.audio.setCallWaiting(value)
    }

    function setAutoAnswer (value: boolean) {
        getLogger()?.log({
            action: 'Set auto answer',
            state: value
        })

        state.opensipsjs?.audio.setAutoAnswer(value)
    }

    function sendDTMF (callId: string, value: string) {
        getLogger()?.log({
            action: 'Send DTMF',
            call_id: callId,
            value
        })

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

    function setMicrophonePermissionAllowed (value: boolean) {
        getLogger()?.log({
            action: 'Microphone permission change',
            state: value
        })

        microphonePermissionAllowed.value = value
    }

    function setVADConfiguration (options: { mode: TNoiseReductionMode }) {
        getLogger()?.log({
            action: 'Set VAD configuration',
            mode: options.mode
        })

        state.opensipsjs?.audio.setVADConfiguration(options)
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
        onSpeakerChange,
        setMicrophonePermissionAllowed,
        setVADConfiguration
    }
}

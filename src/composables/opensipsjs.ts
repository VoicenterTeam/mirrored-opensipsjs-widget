import { ref } from 'vue'
import OpenSIPSJS from '@voicenter-team/opensips-js'
import type { ICall, IOpenSIPSJSOptions, IRoom, RoomChangeEmitType, ICallStatus } from '@voicenter-team/opensips-js/src/types/rtc'
import type { ISIPSCredentials } from '@/types/public-api'
import type { AllActiveCallsStatusType, AllActiveCallsType, CallTimeType, DoHoldFunctionType } from '@/types/opensips'
import type { UnRegisterOptions } from 'jssip/lib/UA'

import { autoAnswerDefaultBehaviour } from '@/composables/useWidgetConfig'

/* Main */
let opensipsjs: OpenSIPSJS

/* State */
export const isOpenSIPSReady = ref<boolean>(false)

/* Device management */
export const activeInputDevice = ref<string>('')
export const inputDevicesList = ref<Array<MediaDeviceInfo>>([])
export const activeOutputDevice = ref<string>('')
export const outputDevicesList = ref<Array<MediaDeviceInfo>>([])
export const ringingDevicesList = ref<Array<MediaDeviceInfo>>([])
export const activeRingingDevice = ref<string>('default')

/* Calls management */
export const allActiveCalls = ref<Array<ICall>>([])
export const allRooms = ref<Array<IRoom>>([])
export const currentActiveRoom = ref<number | undefined>(undefined)
export const allCallStatuses = ref<Array<ICallStatus>>([])

/* Call settings */
export const isMuted = ref<boolean>(false)
export const isMuteWhenJoin = ref<boolean>(false)

/**
 * Helper function to check if OpenSIPSJS is initialized (instance is created)
 *
 * @param opensipsJS
 */
function isOpensips (opensipsJS: OpenSIPSJS | undefined): opensipsJS is OpenSIPSJS {
    return opensipsjs !== undefined
}

function makeOpenSIPSJSOptions (credentials: ISIPSCredentials): IOpenSIPSJSOptions {
    return {
        configuration: {
            session_timers: false,
            uri: `sip:${credentials.username}@${credentials.domain}`,
            password: credentials.password,
        },
        socketInterfaces: [ `wss://${credentials.domain}` ],
        sipDomain: `${credentials.domain}`,
        sipOptions: {
            session_timers: false,
            extraHeaders: [ 'X-Bar: bar' ],
            pcConfig: {},
        },
    }
}

interface CallTimeIntervalsType {
    [key: string]: any
}

export const callTimes = ref<CallTimeType>({})
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

function validateCredentials (credentials: ISIPSCredentials) {
    if (!credentials.username || !credentials.password || !credentials.domain) {
        throw new Error('Invalid credentials')
    }
}

function processCallsTime (calls: AllActiveCallsType) {
    const removedCalls = allActiveCalls.value.filter(oldCall => {
        return !Object.values(calls).some(newCall => {
            return newCall._id === oldCall._id
        })
    })

    removeOldCallTimes(removedCalls)

    const newCalls = Object.values(calls).filter(call => {
        return !allActiveCalls.value.some(existingCall => {
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

/**
 * Helper function to register OpenSIPSJS listeners
 *
 * @param opensipsJS
 */
function registerOpenSIPSListeners (opensipsJS: OpenSIPSJS) {
    return opensipsJS
        .on('ready', (value: boolean) => {
            isOpenSIPSReady.value = value
        })
        .on('changeActiveInputMediaDevice', (value: string) => {
            activeInputDevice.value = value
        })
        .on('changeActiveOutputMediaDevice', (value: string) => {
            activeOutputDevice.value = value
        })
        .on('changeIsMuted', (value: boolean) => {
            isMuted.value = value
        })
        .on('changeMuteWhenJoin', (value: boolean) => {
            isMuteWhenJoin.value = value
        })
        .on('changeAvailableDeviceList', (devices: Array<MediaDeviceInfo>) => {
            const inputDevices = devices.filter(d => d.kind === 'audioinput')
            const outputDevices = devices.filter(d => d.kind === 'audiooutput')

            inputDevicesList.value = [ ...inputDevices ] /*inputDevices.map((d) => ({
                label: d.label,
                deviceId: d.deviceId,
                kind: d.deviceId,
                groupId: d.deviceId,
            }))*/

            outputDevicesList.value = [ ...outputDevices ] /*outputDevices.map((d) => ({
                label: d.label,
                deviceId: d.deviceId,
                kind: d.deviceId,
                groupId: d.deviceId,
            }))*/

            ringingDevicesList.value = [ ...outputDevices ]
        })
        .on('changeActiveCalls', (calls: AllActiveCallsType) => {
            processCallsTime(calls)
            const parsedCalls = Object.values(calls)
            allActiveCalls.value = [ ...parsedCalls ]
        })
        .on('addRoom', (data: RoomChangeEmitType) => {
            const rooms = Object.values(data.roomList)
            allRooms.value = [ ...rooms ]
        })
        .on('updateRoom', (data: RoomChangeEmitType) => {
            const rooms = Object.values(data.roomList)
            allRooms.value = [ ...rooms ]
        })
        .on('removeRoom', (data: RoomChangeEmitType) => {
            const rooms = Object.values(data.roomList)
            allRooms.value = [ ...rooms ]
        })
        .on('currentActiveRoomChanged', (roomId: number | undefined) => {
            currentActiveRoom.value = roomId
        })
        .on('changeCallStatus', (data: AllActiveCallsStatusType) => {
            const statuses = Object.values(data)
            allCallStatuses.value = [ ...statuses ]
        })
}

/**
 * Register OpenSIPSJS instance, set listeners and start it
 *
 * @param credentials
 */
export function registerOpenSIPS (credentials: ISIPSCredentials) {
    return new Promise<OpenSIPSJS>((resolve, reject) => {
        try {
            validateCredentials(credentials)

            if (isOpensips(opensipsjs)) {
                reject('OpenSIPSJS is already initialized')
            }

            const opensipsOptions = makeOpenSIPSJSOptions(credentials)

            opensipsjs = new OpenSIPSJS(opensipsOptions)

            registerOpenSIPSListeners(opensipsjs)
                .on('ready', () => {
                    if (autoAnswerDefaultBehaviour.value) {
                        opensipsjs.setAutoAnswer(true)
                    }

                    resolve(opensipsjs)
                })
                .start()
        } catch (e) {
            reject(e)
        }
    })
}

// TODO: check if this properly restarts receiving events
export function startOpenSIPS () {
    if (isOpensips(opensipsjs)) {
        opensipsjs.start()
    }
}

// TODO: check if this properly stops receiving events and frees resources
export function stopOpenSIPS () {
    if (isOpensips(opensipsjs)) {
        opensipsjs.stop()
    }
}

export function unregisterOpenSIPS (options?: UnRegisterOptions | undefined) {
    if (isOpensips(opensipsjs)) {
        opensipsjs.unregister(options)
    }
}

export function useOpenSIPSJS () {
    function startCall (target: string, addToCurrentRoom = true) {
        opensipsjs.doCall({ target, addToCurrentRoom })
    }

    function answerCall (callId: string) {
        opensipsjs.callAnswer(callId)
    }

    function muteAgent (toMute: boolean) {
        opensipsjs.doMute(toMute)
    }

    function muteCaller (callId: string, toMute: boolean) {
        opensipsjs.muteCaller(callId, toMute)
    }

    function holdCall (params: DoHoldFunctionType) {
        opensipsjs.doCallHold(params)
    }

    async function moveCall (callId: string, roomId: number) {
        await opensipsjs.callMove(callId, roomId)
    }

    function transferCall (callId: string, target: string) {
        opensipsjs.callTransfer(callId, target)
    }

    function mergeCallsInRoom (roomId: number) {
        opensipsjs.callMerge(roomId)
    }

    function terminateCall (callId: string) {
        opensipsjs.callTerminate(callId)
    }

    async function setActiveRoom (roomId: number | undefined) {
        await opensipsjs.setCurrentActiveRoomId(roomId)
    }

    function setAutoAnswer (value: boolean) {
        opensipsjs.setAutoAnswer(value)
    }

    return {
        opensipsjs,
        startCall,
        answerCall,
        muteAgent,
        muteCaller,
        holdCall,
        moveCall,
        transferCall,
        mergeCallsInRoom,
        setActiveRoom,
        terminateCall,
        setAutoAnswer
    }
}

export async function onMicrophoneChange (event: Event) {
    const target = event.target as HTMLSelectElement
    await opensipsjs.setMicrophone(target.value)
}

export async function onSpeakerChange (event: Event) {
    const target = event.target as HTMLSelectElement
    await opensipsjs.setSpeaker(target.value)
}

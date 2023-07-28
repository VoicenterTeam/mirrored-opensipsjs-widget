import { ref } from 'vue'
import OpenSIPSJS from '@voicenter-team/opensips-js'
import type { IOpenSIPSJSOptions } from '@voicenter-team/opensips-js/src/types/rtc'
import type { ISIPSCredentials, IWidgetExternalAPI } from '@/types/public-api'
import type { DoHoldFunctionType } from '@/types/opensips'

let opensipsjs: OpenSIPSJS

export const isOpenSIPSReady = ref<boolean>(false)
export const activeInputDevice = ref<string>('')
export const inputDevicesList = ref<Array<MediaDeviceInfo>>([])
export const activeOutputDevice = ref<string>('')
export const outputDevicesList = ref<Array<MediaDeviceInfo>>([])

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

/**
 * Helper function to register OpenSIPSJS listeners
 *
 * @param opensipsJS
 */
function registerOpenSIPSListeners (opensipsJS: OpenSIPSJS) {
    return opensipsJS
        .on('ready', () => {
            isOpenSIPSReady.value = true
        })
        .on('changeActiveInputMediaDevice', (value: string) => {
            activeInputDevice.value = value
        })
        .on('changeActiveOutputMediaDevice', (value: string) => {
            activeOutputDevice.value = value
        })
        .on('changeAvailableDeviceList', (devices: Array<MediaDeviceInfo>) => {
            const inputDevices = devices.filter(d => d.kind === 'audioinput')
            const outputDevices = devices.filter(d => d.kind === 'audiooutput')

            inputDevicesList.value = [ ...inputDevices ]
            outputDevicesList.value = [ ...outputDevices ]
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
            if (isOpensips(opensipsjs)) {
                reject('OpenSIPSJS is already initialized')
            }

            const opensipsOptions = makeOpenSIPSJSOptions(credentials)

            opensipsjs = new OpenSIPSJS(opensipsOptions)

            registerOpenSIPSListeners(opensipsjs)
                .on('ready', () => {
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
    }
}

/**
 * Build external API for widget
 */
export function useExternalOpenSIPSJS (): IWidgetExternalAPI {
    return {
        on: opensipsjs.on,
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

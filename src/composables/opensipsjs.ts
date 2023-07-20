import { ref } from 'vue'
import OpenSIPSJS from 'opensips-js'
import type { IOpenSIPSJSOptions } from 'opensips-js/src/types/rtc'
import type { ISIPSCredentials, IWidgetExternalAPI } from '@/types/main'

let opensipsjs: OpenSIPSJS
export const activeInputDevice = ref<string>('')
export const inputDevicesList = ref<Array<MediaDeviceInfo>>([])
export const activeOutputDevice = ref<string>('')
export const outputDevicesList = ref<Array<MediaDeviceInfo>>([])

function isOpensips (opensipsJS: OpenSIPSJS | undefined): opensipsJS is OpenSIPSJS {
    return opensipsjs !== undefined
}

export function useOpenSIPSJS () {
    if (!isOpensips(opensipsjs)) {
        throw new Error('OpenSIPSJS is not initialized')
    }

    function startCall (target: string, addToCurrentRoom = true) {
        opensipsjs.doCall({ target, addToCurrentRoom })
    }

    function answerCall (callId: string) {
        opensipsjs.callAnswer(callId)
    }

    return {
        opensipsjs,
        startCall,
        answerCall,
    }
}

export function useExternalOpenSIPSJS (): IWidgetExternalAPI {
    if (!isOpensips(opensipsjs)) {
        throw new Error('OpenSIPSJS is not initialized')
    }

    return {
        on: opensipsjs.on,
    }
}

export function initializeOpenSIPSJS (options: ISIPSCredentials) {
    return new Promise<OpenSIPSJS>((resolve, reject) => {
        try {
            const opensipsOptions: IOpenSIPSJSOptions = {
                configuration: {
                    session_timers: false,
                    uri: `sip:${options.username}@${options.domain}`,
                    password: options.password,
                },
                socketInterfaces: [ `wss://${options.domain}` ],
                sipDomain: `${options.domain}`,
                sipOptions: {
                    session_timers: false,
                    extraHeaders: [ 'X-Bar: bar' ],
                    pcConfig: {},
                },
            }

            const openSIPSJS = opensipsjs = new OpenSIPSJS(opensipsOptions)

            openSIPSJS
                .on('ready', () => {
                    resolve(opensipsjs)
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
                .start()
        } catch (e) {
            reject(e)
        }
    })
}

export async function onMicrophoneChange (event: Event) {
    const target = event.target as HTMLSelectElement
    await opensipsjs.setMicrophone(target.value)
}

export async function onSpeakerChange (event: Event) {
    const target = event.target as HTMLSelectElement
    await opensipsjs.setSpeaker(target.value)
}

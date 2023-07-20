import OpenSIPSJS from 'opensips-js'
import type { IOpenSIPSJSOptions } from 'opensips-js/src/types/rtc'
import type { ISIPSCredentials, IWidgetExternalAPI } from '@/types/main'

let opensipsjs: OpenSIPSJS

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
                .start()
        } catch (e) {
            reject(e)
        }
    })
}

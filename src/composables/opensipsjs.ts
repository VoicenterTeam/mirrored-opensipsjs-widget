import { ref } from 'vue'
import OpenSIPSJS from 'opensips-js'
import type { IOpenSIPSConfiguration } from 'opensips-js/src/types/rtc'
import type { ISIPSCredentials } from '@/types/public-api'
import type { UnRegisterOptions } from 'jssip/lib/UA'
import { vsipAPI, OpensipsConnectOptions } from 'opensips-js-vue'
import { DNDDefaultBehaviour, autoAnswerDefaultBehaviour, callWaitingDefaultBehaviour } from '@/composables/useWidgetConfig'
import { getVideoApi, getVideoState, registerVideoListeners } from '@/composables/video'
import { getAudioApi, getAudioState } from '@/composables/audio'
import state from '@/composables/state'
import { getLogger } from '@/plugins/logger'
import { safeStringify } from '@/utils/safeStringify'
import * as VAD from '@ricky0123/vad-web'

/* State */
export const isOpenSIPSReady = vsipAPI.state.isOpenSIPSReady
export const isOpenSIPSReconnecting = vsipAPI.state.isOpenSIPSReconnecting
export const isOpenSIPSInitialized = ref<boolean>(false)
export const usedWidgetShadowRootEl = ref<HTMLElement>()

/**
 * Helper function to check if OpenSIPSJS is initialized (instance is created)
 *
 * @param opensipsJS
 */
function isOpensips (opensipsJS: OpenSIPSJS | undefined): opensipsJS is OpenSIPSJS {
    return opensipsJS !== undefined
}

function validateCredentials (credentials: ISIPSCredentials) {
    if (!credentials.username || (!credentials.password && !credentials.authorization_jwt) || !credentials.domain) {
        throw new Error('Invalid credentials')
    }
}

/**
 * Register OpenSIPSJS instance, set listeners and start it
 *
 * @param credentials
 */
export function startOpenSIPS (credentials: ISIPSCredentials) {
    return new Promise<OpenSIPSJS>((resolve, reject) => {
        try {
            validateCredentials(credentials)

            const connectOptions: OpensipsConnectOptions = {
                domain: credentials.domain,
                username: credentials.username,
                modules: [ 'audio', 'video' ]
            }

            if (credentials.authorization_jwt) {
                connectOptions.authorization_jwt = credentials.authorization_jwt
            }

            if (credentials.password) {
                connectOptions.password = credentials.password
            }

            const opensipsConfiguration: Partial<IOpenSIPSConfiguration> = {
                onTransportCallback: (message: object) => {
                    getLogger()?.debug({
                        action: 'New message',
                        body: safeStringify(message)
                    })
                },
                noiseReductionOptions: {
                    mode: 'dynamic',
                    vadModule: VAD
                }
            };

            (vsipAPI.actions.init(connectOptions, {}, opensipsConfiguration) as Promise<OpenSIPSJS>).then(
                (opensipsjs: OpenSIPSJS) => {
                    state.opensipsjs = opensipsjs

                    registerVideoListeners(state.opensipsjs)
                        .on('connection', () => {
                            const { isCallWaitingEnabled, isDND } = getAudioState()

                            if (autoAnswerDefaultBehaviour.value) {
                                state.opensipsjs?.audio.setAutoAnswer(true)
                            }

                            if(callWaitingDefaultBehaviour.value !== isCallWaitingEnabled.value) {
                                state.opensipsjs?.audio.setCallWaiting(callWaitingDefaultBehaviour.value)
                            }

                            if(DNDDefaultBehaviour.value !== isDND.value ) {
                                state.opensipsjs?.audio.setDND(DNDDefaultBehaviour.value)
                            }

                            resolve(opensipsjs)
                        })
                    //.begin()

                    opensipsjs.on('changeActiveInputMediaDevice', (value: string) => {
                        getLogger()?.log({
                            action: 'Change microphone device',
                            device_id: value
                        })
                    })

                    opensipsjs.on('changeActiveOutputMediaDevice', (value: string) => {
                        getLogger()?.log({
                            action: 'Change speaker device',
                            device_id: value
                        })
                    })

                    opensipsjs.on('changeAvailableDeviceList', (event: MediaDeviceInfo[]) => {
                        getLogger()?.log({
                            action: 'Available media devices list changed',
                            devices: event
                        })
                    })

                    isOpenSIPSInitialized.value = true
                })
        } catch (e) {
            reject(e)
        }
    })
}

export function tryRegisterOpenSIPS (): OpenSIPSJS | undefined | void {
    if (isOpensips(state.opensipsjs)) {
        state.opensipsjs?.register()

        return state.opensipsjs
    }
}

// TODO: check if this properly restarts receiving events
export function beginOpenSIPS () {
    if (isOpensips(state.opensipsjs)) {
        state.opensipsjs?.begin()
    }
}

// TODO: check if this properly stops receiving events and frees resources
export function stopOpenSIPS () {
    if (isOpensips(state.opensipsjs)) {
        state.opensipsjs?.stop()
    }
}

export function disconnectOpenSIPS () {
    if (isOpensips(state.opensipsjs)) {
        state.opensipsjs?.disconnect()
    }
}

export function unregisterOpenSIPS (options?: UnRegisterOptions | undefined) {
    if (isOpensips(state.opensipsjs)) {
        state.opensipsjs?.unregister(options)
    }
}

export function useOpenSIPSJS () {
    return {
        state,
        getVideoApi,
        getVideoState,
        getAudioApi,
        getAudioState
    }
}

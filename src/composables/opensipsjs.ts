import { ref } from 'vue'
import OpenSIPSJS from 'opensips-js'
import type { ISIPSCredentials } from '@/types/public-api'
import type { UnRegisterOptions } from 'jssip/lib/UA'
import { vsipAPI, OpensipsConnectOptions } from 'opensips-js-vue'
import { DNDDefaultBehaviour, autoAnswerDefaultBehaviour, callWaitingDefaultBehaviour } from '@/composables/useWidgetConfig'
import { getVideoApi, getVideoState, registerVideoListeners } from '@/composables/video'
import { getAudioApi, getAudioState } from '@/composables/audio'
import state from '@/composables/state'

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
    console.log('LLL startOpenSIPS')
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

            (vsipAPI.actions.init(connectOptions, {}) as Promise<OpenSIPSJS>).then(
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

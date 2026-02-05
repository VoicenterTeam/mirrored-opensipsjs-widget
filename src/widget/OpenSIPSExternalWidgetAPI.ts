import type {
    ISIPSCredentials,
    IWidgetExternalAPI,
    IWidgetExternalAPIConstructor,
    TWidgetConfigOptions,
    IVSIPActionsAPI,
    IDisplayAPI,
    IDisplayResolvers
} from '@/types/public-api'
import { getConfig, setConfig } from '@/composables/useWidgetConfig'
import { useOpenSIPSJS, startOpenSIPS, disconnectOpenSIPS } from '@/composables/opensipsjs'
import { useDisplayResolvers } from '@/composables/useDisplayResolvers'
import type { ListenerCallbackFnType, ListenersKeyType } from 'opensips-js/src/types/listeners'
import { setLogger, WebStorageLogger } from '@/plugins/logger'

const { getAudioApi, getVideoApi, getAudioState } = useOpenSIPSJS()
const {
    startCall,
    answerCall,
    terminateCall,
    holdCall,
    unholdCall,
    transferCall,
    moveCall,
    mergeCallsInRoom,
    mergeCallByIds,
    sendDTMF,
    mute,
    muteCaller,
    setDND,
    setAutoAnswer,
    setCallWaiting,
    setActiveRoom,
    setSpeakerVolume,
    setMicrophoneSensitivity
} = getAudioApi()

const { initVideoCall } = getVideoApi()

const OpenSIPSExternalWidgetAPI: IWidgetExternalAPIConstructor = class OpenSIPSExternalWidgetAPI implements IWidgetExternalAPI {
    private state
    public readonly vsip: IVSIPActionsAPI
    public readonly display: IDisplayAPI
    public readonly logger: WebStorageLogger | undefined

    constructor (config: TWidgetConfigOptions) {
        setConfig(config)

        const { state } = useOpenSIPSJS()
        this.state = state

        // Initialize VSIP actions API
        this.vsip = this.createVSIPActionsAPI()

        // Initialize display customization API
        this.display = this.createDisplayAPI()

        // Initialize logger
        if (config.loggerSettings?.useLogger && config.loggerSettings?.loggerConfig) {
            this.logger = setLogger(config.loggerSettings.loggerConfig)
        }
    }

    private createVSIPActionsAPI (): IVSIPActionsAPI {
        return {
            startCall: (target: string, addToCurrentRoom = false, holdOtherCalls = false) => {
                startCall(target, addToCurrentRoom, holdOtherCalls)
            },

            answerCall: (callId: string) => {
                answerCall(callId)
            },

            terminateCall: (callId: string) => {
                terminateCall(callId)
            },

            holdCall: (callId: string) => {
                holdCall(callId)
            },

            unholdCall: (callId: string) => {
                unholdCall(callId)
            },

            transferCall: (callId: string, target: string) => {
                transferCall(callId, target)
            },

            moveCall: async (callId: string, roomId: number) => {
                await moveCall(callId, roomId)
            },

            mergeCallsInRoom: (roomId: number) => {
                mergeCallsInRoom(roomId)
            },

            mergeCallByIds: (firstCallId: string, secondCallId: string) => {
                mergeCallByIds(firstCallId, secondCallId)
            },

            sendDTMF: (callId: string, value: string) => {
                sendDTMF(callId, value)
            },

            mute: (toMute: boolean) => {
                mute(toMute)
            },

            muteCaller: (callId: string, toMute: boolean) => {
                muteCaller(callId, toMute)
            },

            setDND: (value: boolean) => {
                setDND(value)
            },

            setAutoAnswer: (value: boolean) => {
                setAutoAnswer(value)
            },

            setCallWaiting: async (state: boolean) => {
                await setCallWaiting(state)
            },

            setActiveRoom: async (roomId: number | undefined) => {
                await setActiveRoom(roomId)
            },

            setSpeakerVolume: (value: number) => {
                setSpeakerVolume(value)
            },

            setMicrophoneSensitivity: (value: number) => {
                setMicrophoneSensitivity(value)
            }
        }
    }

    private createDisplayAPI (): IDisplayAPI {
        const displayResolvers = useDisplayResolvers()

        return {
            setResolver: <K extends keyof IDisplayResolvers>(
                type: K,
                resolver: IDisplayResolvers[K] | null
            ) => {
                displayResolvers.setResolver(type, resolver)
            },

            setResolvers: (resolvers: Partial<IDisplayResolvers>) => {
                displayResolvers.setResolvers(resolvers)
            },

            getResolver: <K extends keyof IDisplayResolvers>(type: K) => {
                return displayResolvers.getResolver(type)
            },

            hasResolver: (type: keyof IDisplayResolvers) => {
                return displayResolvers.hasResolver(type)
            },

            clearResolver: (type: keyof IDisplayResolvers) => {
                displayResolvers.clearResolver(type)
            },

            clearAll: () => {
                displayResolvers.clearAll()
            }
        }
    }

    public setConfig (config: TWidgetConfigOptions) {
        setConfig(config)

        return this
    }

    public getConfig () {
        return getConfig()
    }

    public getAudioState () {
        return getAudioState()
    }

    public on <T extends ListenersKeyType> (event: T, listener: ListenerCallbackFnType<T>) {
        this.state.opensipsjs?.on(event, listener)

        return this
    }

    public async login (credentials: ISIPSCredentials) {
        await startOpenSIPS(credentials)

        return this
    }

    public async initVideoCall (target: string, name: string) {
        initVideoCall(target, name)
    }

    public disconnect () {
        disconnectOpenSIPS()

        return this
    }
}

export default OpenSIPSExternalWidgetAPI

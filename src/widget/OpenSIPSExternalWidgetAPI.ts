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
import { useDisplayResolvers } from '@/composables/useCallerInfo'
import type { ListenerCallbackFnType, ListenersKeyType } from 'opensips-js/src/types/listeners'

const OpenSIPSExternalWidgetAPI: IWidgetExternalAPIConstructor = class OpenSIPSExternalWidgetAPI implements IWidgetExternalAPI {
    private state
    public readonly vsip: IVSIPActionsAPI
    public readonly display: IDisplayAPI

    constructor (config: TWidgetConfigOptions) {
        setConfig(config)

        const { state } = useOpenSIPSJS()
        this.state = state

        // Initialize VSIP actions API
        this.vsip = this.createVSIPActionsAPI()

        // Initialize display customization API
        this.display = this.createDisplayAPI()
    }

    private createVSIPActionsAPI(): IVSIPActionsAPI {
        return {
            startCall: (target: string, addToCurrentRoom = false, holdOtherCalls = false) => {
                const { startCall } = useOpenSIPSJS()
                startCall(target, addToCurrentRoom, holdOtherCalls)
            },

            answerCall: (callId: string) => {
                const { answerCall } = useOpenSIPSJS()
                answerCall(callId)
            },

            terminateCall: (callId: string) => {
                const { terminateCall } = useOpenSIPSJS()
                terminateCall(callId)
            },

            holdCall: (callId: string) => {
                const { holdCall } = useOpenSIPSJS()
                holdCall(callId)
            },

            unholdCall: (callId: string) => {
                const { unholdCall } = useOpenSIPSJS()
                unholdCall(callId)
            },

            transferCall: (callId: string, target: string) => {
                const { transferCall } = useOpenSIPSJS()
                transferCall(callId, target)
            },

            moveCall: async (callId: string, roomId: number) => {
                const { moveCall } = useOpenSIPSJS()
                await moveCall(callId, roomId)
            },

            mergeCallsInRoom: (roomId: number) => {
                const { mergeCallsInRoom } = useOpenSIPSJS()
                mergeCallsInRoom(roomId)
            },

            mergeCallByIds: (firstCallId: string, secondCallId: string) => {
                const { mergeCallByIds } = useOpenSIPSJS()
                mergeCallByIds(firstCallId, secondCallId)
            },

            sendDTMF: (callId: string, value: string) => {
                const { sendDTMF } = useOpenSIPSJS()
                sendDTMF(callId, value)
            },

            mute: (toMute: boolean) => {
                const { mute } = useOpenSIPSJS()
                mute(toMute)
            },

            muteCaller: (callId: string, toMute: boolean) => {
                const { muteCaller } = useOpenSIPSJS()
                muteCaller(callId, toMute)
            },

            setDND: (value: boolean) => {
                const { setDND } = useOpenSIPSJS()
                setDND(value)
            },

            setAutoAnswer: (value: boolean) => {
                const { setAutoAnswer } = useOpenSIPSJS()
                setAutoAnswer(value)
            },

            setCallWaiting: async (state: boolean) => {
                const { setCallWaiting } = useOpenSIPSJS()
                await setCallWaiting(state)
            },

            setActiveRoom: async (roomId: number | undefined) => {
                const { setActiveRoom } = useOpenSIPSJS()
                await setActiveRoom(roomId)
            },

            setSpeakerVolume: (value: number) => {
                const { setSpeakerVolume } = useOpenSIPSJS()
                setSpeakerVolume(value)
            },

            setMicrophoneSensitivity: (value: number) => {
                const { setMicrophoneSensitivity } = useOpenSIPSJS()
                setMicrophoneSensitivity(value)
            }
        }
    }

    private createDisplayAPI(): IDisplayAPI {
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

    public on <T extends ListenersKeyType> (event: T, listener: ListenerCallbackFnType<T>) {
        this.state.opensipsjs?.on(event, listener)

        return this
    }

    public async login (credentials: ISIPSCredentials) {
        await startOpenSIPS(credentials)

        return this
    }

    public async initVideoCall (target: string, name: string) {
        const { initVideoCall } = useOpenSIPSJS()
        initVideoCall(target, name)
    }

    public disconnect () {
        disconnectOpenSIPS()

        return this
    }
}

export default OpenSIPSExternalWidgetAPI

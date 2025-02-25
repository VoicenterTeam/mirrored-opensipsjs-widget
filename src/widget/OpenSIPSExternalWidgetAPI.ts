import type {
    ISIPSCredentials,
    IWidgetExternalAPI,
    IWidgetExternalAPIConstructor,
    TWidgetConfigOptions
} from '@/types/public-api'
import { getConfig, setConfig } from '@/composables/useWidgetConfig'
import { useOpenSIPSJS, startOpenSIPS, disconnectOpenSIPS } from '@/composables/opensipsjs'
import type { ListenerCallbackFnType, ListenersKeyType } from '@voicenter-team/opensips-js/src/types/listeners'

const OpenSIPSExternalWidgetAPI: IWidgetExternalAPIConstructor = class OpenSIPSExternalWidgetAPI implements IWidgetExternalAPI {
    private state

    constructor (config: TWidgetConfigOptions) {
        setConfig(config)

        const { state } = useOpenSIPSJS()

        this.state = state
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

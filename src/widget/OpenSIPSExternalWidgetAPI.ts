import type {
    ISIPSCredentials,
    IWidgetExternalAPI,
    IWidgetExternalAPIConstructor,
    TWidgetConfigOptions
} from '@/types/public-api'
import { getConfig, setConfig } from '@/composables/useWidgetConfig'
import { useOpenSIPSJS, startOpenSIPS } from '@/composables/opensipsjs'
import type { ListenerCallbackFnType, ListenersKeyType } from '@voicenter-team/opensips-js/src/types/listeners'

const OpenSIPSExternalWidgetAPI: IWidgetExternalAPIConstructor = class OpenSIPSExternalWidgetAPI implements IWidgetExternalAPI {
    private opensipsjs

    constructor (config: TWidgetConfigOptions) {
        setConfig(config)

        const { opensipsjs } = useOpenSIPSJS()

        this.opensipsjs = opensipsjs
    }

    public setConfig (config: TWidgetConfigOptions) {
        setConfig(config)

        return this
    }

    public getConfig () {
        return getConfig()
    }

    public on <T extends ListenersKeyType> (event: T, listener: ListenerCallbackFnType<T>) {
        this.opensipsjs.on(event, listener)

        return this
    }

    public async login (credentials: ISIPSCredentials) {
        await startOpenSIPS(credentials)

        return this
    }
}

export default OpenSIPSExternalWidgetAPI

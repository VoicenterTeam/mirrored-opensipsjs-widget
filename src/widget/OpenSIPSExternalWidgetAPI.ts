import { jwtDecode } from "jwt-decode";
import type {
    ISIPSCredentials,
    IWidgetExternalAPI,
    IWidgetExternalAPIConstructor,
    TWidgetConfigOptions
} from '@/types/public-api'
import { getConfig, setConfig } from '@/composables/useWidgetConfig'
import { useOpenSIPSJS, startOpenSIPS } from '@/composables/opensipsjs'
import { getQueryParams } from '@/helpers/queryParam'
import type { ListenerCallbackFnType, ListenersKeyType } from '@voicenter-team/opensips-js/src/types/listeners'

const OpenSIPSExternalWidgetAPI: IWidgetExternalAPIConstructor = class OpenSIPSExternalWidgetAPI implements IWidgetExternalAPI {
    private opensipsjs

    constructor (options: TWidgetConfigOptions) {
        const config = { ...options }

        const token = getQueryParams('token')

        if (token && config.callSettings && config.themeSettings) {
            config.themeSettings.layoutConfig.type = 'quickCall'

            const decoded = jwtDecode(token) as { to: string }

            if (decoded?.to) {
                config.callSettings.quickCallNumber = decoded.to
            }
        }

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
        const config = getConfig()

        credentials.domain = config.callSettings.domain

        const token = getQueryParams('token')
        if (token) {
            delete credentials.password
            credentials.authorization_jwt = `Bearer ${token}`
        }

        const username = getQueryParams('username')
        if (username) {
            credentials.username = username
        }

        await startOpenSIPS(credentials)

        return this
    }
}

export default OpenSIPSExternalWidgetAPI

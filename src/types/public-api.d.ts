import type { ListenerCallbackFnType, ListenersKeyType } from 'opensips-js/src/types/listeners'
import type { ICallSettings, ILayoutConfig } from '@/types/internal'
import type OpenSIPSExternalWidgetAPI from '@/widget/OpenSIPSExternalWidgetAPI'

export namespace Widget {
    /**
     * Represents the event map for the widget.
     */
    export type EventMap = {
        'widget:ready': OpenSIPSExternalWidgetAPI,
        'widget:destroy': undefined,
    }

    /**
     * Represents the dispatch action event for the widget.
     */
    export type DispatchActionEvent = <Event extends keyof EventMap>(
        event: Event,
        data: EventMap[Event]
    ) => void
}

/**
 * Represents SIP credentials.
 */
export interface ISIPSCredentials {
    username: string
    password: string
    domain: string
}

/**
 * The colors of the widget:
 */
export type ColorsType =
    'primary'
    | 'secondary'
    | 'main-text'
    | 'secondary-text'
    | 'button-pressed-text'
    | 'border-lines'
    | 'primary-bg'
    | 'secondary-bg'
    | 'inactive-bg'
    | 'success'
    | 'danger'
    | 'additional-danger-bg'
    | 'additional-success-bg'
    | 'additional-bg'

/**
 * Represents the configuration options for the widget theme.
 */
export interface IWidgetTheme {
    colors: Record<ColorsType, string>
    layoutConfig: ILayoutConfig
}

export interface IWidgetConfig {
    themeSettings: IWidgetTheme
    callSettings: ICallSettings
}

/**
 * Represents the configuration options for the widget.
 */
export type TWidgetConfigOptions = Partial<IWidgetConfig>

/**
 * Represents the external API provided by the widget.
 */
export interface IWidgetExternalAPI {
    /**
     * Allows subscribing to sips events.
     *
     * @param type - type of event, check ListenersKeyType
     * @param listener - the event listener, check ListenerCallbackFnType of provided event
     */
    on: <T extends ListenersKeyType> (type: T, listener: ListenerCallbackFnType<T>) => IWidgetExternalAPI

    /**
     * Changes the widget configuration.
     *
     * @param config
     */
    setConfig: (config: TWidgetConfigOptions) => IWidgetExternalAPI

    /**
     * Logs in to the SIP server.
     *
     * @param credentials
     */
    login: (credentials: ISIPSCredentials) => Promise<IWidgetExternalAPI>
}

export interface IWidgetExternalAPIConstructor {
    new (config: TWidgetConfigOptions): IWidgetExternalAPI
}

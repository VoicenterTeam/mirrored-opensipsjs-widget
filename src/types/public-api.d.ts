import type { ListenerCallbackFnType, ListenersKeyType } from 'opensips-js/src/types/listeners'
import type { ICallSettings, ILayoutConfig } from '@/types/internal'

export namespace Widget {
    /**
     * Represents the event map for the widget.
     */
    export type EventMap = {
        'widget:ready': IWidgetInit
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
    | 'primary-bg'
    | 'secondary-bg'
    | 'primary-text'
    | 'secondary-text'
    | 'success'
    | 'danger'
    | 'border-lines'
    | 'button-pressed-text'

/**
 * Represents the configuration options for the widget theme.
 */
export interface IWidgetTheme {
    colors: Record<ColorsType, string>
    layoutConfig: ILayoutConfig
}

/**
 * Represents the configuration options for the widget.
 */
export interface IWidgetConfigOptions {
    themeSettings: IWidgetTheme
    callSettings: ICallSettings
}

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
    on: <T extends ListenersKeyType> (type: T, listener: ListenerCallbackFnType<T>) => void
}

/**
 * Represents the initialization options for the widget.
 */
export interface IWidgetInitOptions {
    credentials: ISIPSCredentials
    config: IWidgetConfigOptions
}

/**
 * Represents the widget initialization function.
 */
export type IWidgetInit = (initOptions: IWidgetInitOptions) => Promise<IWidgetExternalAPI>

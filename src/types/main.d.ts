import type { ListenerCallbackFnType, ListenersKeyType } from 'opensips-js/src/types/listeners'

// ----------------------------------------------
// Domain Types
// ----------------------------------------------
export interface ISIPSCredentials {
    username: string
    password: string
    domain: string
}

export interface IWidgetTheme {
    color: string
}

export interface IWidgetConfigOptions {
    colors: Record<string, string>
}

export interface IWidgetExternalAPI {
    /**
     * Ability to subscribe to sips events
     *
     * @param type - type of event, check ListenersKeyType
     * @param listener - the event listener, check ListenerCallbackFnType of provided event
     */
    on: <T extends ListenersKeyType> (type: T, listener: ListenerCallbackFnType<T>) => void
}

// ----------------------------------------------
// Component Types
// ----------------------------------------------
export namespace Widget {
    export type Attributes = 'theme'
    export type EventMap = {
        'widget:ready': IWidgetInit
    }
    export type DispatchActionEvent = <Event extends keyof EventMap>(
        event: Event,
        data: EventMap[Event]
    ) => void
}

export interface IWidgetAppProps {
    dispatchActionEvent: Widget.DispatchActionEvent
    theme: IWidgetTheme
    dragStart: (e: MouseEvent) => void
}

export interface IWidgetAttributes {
    theme?: string
}

export interface IWidgetInitOptions {
    credentials: ISIPSCredentials
    config: IWidgetConfigOptions
}

export type IWidgetInit = (initOptions: IWidgetInitOptions) => Promise<IWidgetExternalAPI>

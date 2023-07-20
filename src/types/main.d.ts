import { ListenerCallbackFnType, ListenersKeyType } from 'opensips-js/src/types/listeners'

export interface TWidgetEventMap {
    'widget:ready': string
}

export type TDispatchActionEvent = <Event extends keyof TWidgetEventMap, Data extends TWidgetEventMap<Event>> (event: Event, data: Data) => void

export interface IWidgetAppProps {
    dispatchActionEvent: TDispatchActionEvent
    credentials: ISIPSCredentials
    theme: IWidgetTheme
    dragStart: (e: MouseEvent) => void
    drag: (e: MouseEvent) => void
    dragEnd: () => void
}

export interface IWidgetAttributes {
    credentials?: string
    theme?: string
}

export interface IWidgetAttributesParsed {
    credentials?: ISIPSCredentials
    theme?: IWidgetTheme
}

export interface ISIPSCredentials {
    username: string
    password: string
    domain: string
}

export interface IWidgetTheme {
    color: string
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

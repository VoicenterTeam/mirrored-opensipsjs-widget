import type { Widget } from '@/types/public-api'

export interface OpenSIPSWidgetElement extends HTMLElement {
    dispatchEvent: Widget.DispatchActionEvent
    addEventListener: {
        <K extends keyof Widget.EventMap>(type: K, listener: (this: OpenSIPSWidgetElement, ev: CustomEvent<Widget.EventMap[K]>) => any, options?: boolean | AddEventListenerOptions): void;
        (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    }
}
declare global {
    interface HTMLElementEventMap extends Record<keyof Widget.EventMap, CustomEvent<Widget.EventMap[keyof Widget.EventMap]>> {}

    interface HTMLElementTagNameMap {
        'opensips-widget': OpenSIPSWidgetElement
    }
}

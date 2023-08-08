import type { Widget as PublicWidget } from '@/types/public-api'

export interface OpenSIPSWidgetElement extends HTMLElement {
    dispatchEvent(event: CustomEvent): boolean
    dispatchEvent<Event extends keyof PublicWidget.EventMap>(
        event: Event,
        data: PublicWidget.EventMap[Event]
    ): void
    addEventListener: {
        <K extends keyof PublicWidget.EventMap>(type: K, listener: (this: OpenSIPSWidgetElement, ev: CustomEvent<PublicWidget.EventMap[K]>) => any, options?: boolean | AddEventListenerOptions): void
        (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void
    }
}
declare global {
    interface HTMLElementEventMap extends Record<keyof PublicWidget.EventMap, CustomEvent<PublicWidget.EventMap[keyof PublicWidget.EventMap]>> {}

    interface HTMLElementTagNameMap {
        'opensips-widget': OpenSIPSWidgetElement
    }
}

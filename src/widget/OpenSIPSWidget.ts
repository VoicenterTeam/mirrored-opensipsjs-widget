import { createApp, h } from 'vue'
import Popper from 'vue3-popper'
import VLoading from 'v-loading-directive'
import 'construct-style-sheets-polyfill'
import { twind, cssom, observe } from '@twind/core'
import styles from '@/styles/style.css?inline'

import config from 'root/twind.config'
import type { IWidgetAppProps } from '@/types/internal'
import type { IWidgetExternalAPIConstructor, Widget as PublicWidget } from '@/types/public-api'

import App from '@/App.vue'
import { ActiveTabPlugin } from '@/plugins/activeTabPlugin'
import { removeListeners } from '@/composables/useWidgetDraggable'

const cssStyleSheet = new CSSStyleSheet()
cssStyleSheet.insertRule(styles)
const sheet = cssom(cssStyleSheet)
const tw = twind(config, sheet)

interface OpenSIPSWidgetElementEventMap extends HTMLElementEventMap {
    'widget:ready': CustomEvent<IWidgetExternalAPIConstructor>
    'widget:destroy': CustomEvent<undefined>
}

export class OpenSIPSWidget extends HTMLElement {
    constructor () {
        super()
    }

    // Lifecycle hooks
    connectedCallback () {
        this.mountVueApp()
    }

    // Event dispatcher
    public dispatchEvent(event: Event): boolean;
    public dispatchEvent<Event extends keyof PublicWidget.EventMap>(
        event: Event,
        data: PublicWidget.EventMap[Event]
    ): void
    public dispatchEvent (event: Event | keyof PublicWidget.EventMap, data?: PublicWidget.EventMap[keyof PublicWidget.EventMap]): boolean | void {
        if (typeof event === 'string') {
            super.dispatchEvent(
                new CustomEvent(event, { bubbles: true, detail: data })
            )
            return
        } else if (event instanceof Event) {
            return super.dispatchEvent(event)
        } else {
            throw new Error('Invalid event type')
        }
    }

    addEventListener<K extends keyof OpenSIPSWidgetElementEventMap> (
        type: K,
        listener: (this: OpenSIPSWidget, ev: OpenSIPSWidgetElementEventMap[K]) => any,
        options?: boolean | AddEventListenerOptions
    ): void {
        super.addEventListener(type, listener as EventListenerOrEventListenerObject, options)
    }

    public disconnectedCallback () {
        removeListeners()
    }

    // Mount Vue application
    private mountVueApp () {
        const shadowRoot = this.attachShadow({ mode: 'open' })
        const div = document.createElement('div')
        shadowRoot.appendChild(div)
        shadowRoot.adoptedStyleSheets = [ sheet.target ]
        observe(tw, shadowRoot)

        const appProps: IWidgetAppProps = {
            widgetElement: this
        }

        const app = createApp({
            render: () => h(App, appProps),
        })

        app
            .use(ActiveTabPlugin)
            .component('Popper', Popper)
            .directive('loading', VLoading)

        app.mount(div)
    }
}

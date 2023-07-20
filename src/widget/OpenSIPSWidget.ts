import { createApp, h } from 'vue'
import 'construct-style-sheets-polyfill'
import { twind, cssom, observe } from '@twind/core'

import config from 'root/twind.config'
import type { TDispatchActionEvent, IWidgetAttributes, IWidgetAppProps } from '@/types/main'
import { parseAndValidateCredentials, parseAndValidateTheme } from '@/utils/validate'
import { dragStart, drag, dragEnd } from '@/utils/dragDrop'

import App from '@/App.vue'

const sheet = cssom(new CSSStyleSheet())
const tw = twind(config, sheet)

export class OpenSIPSWidget extends HTMLElement implements IWidgetAttributes {
    static observedAttributes = [ 'credentials', 'theme' ]

    credentials?: string
    theme?: string

    constructor () {
        super()
    }

    // Lifecycle hooks
    connectedCallback () {
        this.mountVueApp()
        this.style.position = 'absolute'  // make sure it's positioned absolute or fixed
    }

    attributeChangedCallback (name: string, oldValue: string, newValue: string) {
        if (oldValue !== newValue) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            this[name] = newValue
        }
    }

    // Drag and drop methods
    dragStart = (e: MouseEvent) => dragStart(e, this)
    drag = (e: MouseEvent) => drag(e, this)
    dragEnd = () => dragEnd()


    // Event dispatcher
    private dispatchActionEvent: TDispatchActionEvent = (event, data) => {
        this.dispatchEvent(
            new CustomEvent(event, { bubbles: true, detail: data })
        )
    }

    // Mount Vue application
    private mountVueApp () {
        const credentials = parseAndValidateCredentials(this.credentials)
        if (!credentials) {
            console.error('OpenSIPS widget initialization failed: credentials are invalid or missing. Did you forget to set the "credentials" attribute?')
            return
        }

        const shadowRoot = this.attachShadow({ mode: 'open' })
        const div = document.createElement('div')
        shadowRoot.appendChild(div)
        shadowRoot.adoptedStyleSheets = [ sheet.target ]
        observe(tw, shadowRoot)

        const appProps: IWidgetAppProps = {
            credentials,
            theme: parseAndValidateTheme(this.theme),
            dispatchActionEvent: this.dispatchActionEvent,
            dragStart: this.dragStart,
            drag: this.drag,
            dragEnd: this.dragEnd,
        }

        createApp({
            render: () => h(App, appProps),
        }).mount(div)
    }
}

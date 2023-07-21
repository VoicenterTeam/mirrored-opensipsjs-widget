import { createApp, h } from 'vue'
import 'construct-style-sheets-polyfill'
import { twind, cssom, observe } from '@twind/core'

import config from 'root/twind.config'
import type { Widget, IWidgetAttributes, IWidgetAppProps } from '@/types/main'
import { parseAndValidateTheme } from '@/utils/validate'
import { dragStart, drag, dragEnd, updatePositionOnResize } from '@/utils/dragDrop'

import App from '@/App.vue'

const sheet = cssom(new CSSStyleSheet())
const tw = twind(config, sheet)

export class OpenSIPSWidget extends HTMLElement implements IWidgetAttributes {
    static observedAttributes: Array<Widget.Attributes> = [ 'theme' ]

    // From attributes
    theme?: string

    // Drag and drop methods
    dragStart
    drag
    dragEnd
    updatePositionOnResize

    constructor () {
        super()
        this.dragStart = (e: MouseEvent) => dragStart(e, this)
        this.drag = (e: MouseEvent) => drag(e, this)
        this.dragEnd = () => dragEnd()
        this.updatePositionOnResize = () => updatePositionOnResize(this)
    }

    // Lifecycle hooks
    connectedCallback () {
        this.mountVueApp()
        this.style.position = 'fixed'
        window.addEventListener('resize', this.updatePositionOnResize)
    }

    disconnectedCallback () {
        window.removeEventListener('resize', this.updatePositionOnResize)
    }

    attributeChangedCallback (name: Widget.Attributes, oldValue: string, newValue: string) {
        if (oldValue !== newValue) {
            this[name] = newValue
        }
    }


    // Event dispatcher
    private dispatchActionEvent: Widget.DispatchActionEvent = (event, data) => {
        this.dispatchEvent(
            new CustomEvent(event, { bubbles: true, detail: data })
        )
    }

    // Mount Vue application
    private mountVueApp () {
        const shadowRoot = this.attachShadow({ mode: 'open' })
        const div = document.createElement('div')
        shadowRoot.appendChild(div)
        shadowRoot.adoptedStyleSheets = [ sheet.target ]
        observe(tw, shadowRoot)

        const appProps: IWidgetAppProps = {
            theme: parseAndValidateTheme(this.theme),
            dispatchActionEvent: this.dispatchActionEvent,
            dragStart: this.dragStart
        }

        createApp({
            render: () => h(App, appProps),
        }).mount(div)
    }
}

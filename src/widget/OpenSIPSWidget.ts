import { createApp, h } from 'vue'
import Popper from 'vue3-popper'
import 'construct-style-sheets-polyfill'
import { twind, cssom, observe } from '@twind/core'
import styles from '@/styles/style.css?inline'
import selectStyles from 'vue-select/dist/vue-select.css?inline'

import config from 'root/twind.config'
import type { Widget as InternalWidget, IWidgetAttributes, IWidgetAppProps } from '@/types/internal'
import type { Widget as PublicWidget } from '@/types/public-api'
import { dragStart, drag, dragEnd, updatePositionOnResize } from '@/utils/dragDrop'

import App from '@/App.vue'
import { ActiveTabPlugin } from '@/plugins/activeTabPlugin'

const cssStyleSheet = new CSSStyleSheet()
cssStyleSheet.insertRule(styles)
cssStyleSheet.insertRule(`* { ${selectStyles} }`)
const sheet = cssom(cssStyleSheet)
const tw = twind(config, sheet)

export class OpenSIPSWidget extends HTMLElement implements IWidgetAttributes {
    static observedAttributes: Array<InternalWidget.Attributes> = [ 'theme' ]

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

    attributeChangedCallback (name: InternalWidget.Attributes, oldValue: string, newValue: string) {
        if (oldValue !== newValue) {
            this[name] = newValue
        }
    }


    // Event dispatcher
    private dispatchActionEvent: PublicWidget.DispatchActionEvent = (event, data) => {
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
            dispatchActionEvent: this.dispatchActionEvent,
            dragStart: this.dragStart
        }

        const app = createApp({
            render: () => h(App, appProps),
        })

        app
            .use(ActiveTabPlugin)
            .component('Popper', Popper)

        app.mount(div)
    }
}

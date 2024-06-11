import { OpenSIPSWidget } from '@/widget/OpenSIPSWidget'

customElements.define('opensips-widget', OpenSIPSWidget)

declare global {
    interface HTMLElementTagNameMap {
        'opensips-widget': OpenSIPSWidget
    }
}

export { OpenSIPSWidget }

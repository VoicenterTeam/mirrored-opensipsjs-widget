import { OpenSIPSWidget } from '@/widget/OpenSIPSWidget'

export type * from '@/types/public-api'

customElements.define('opensips-widget', OpenSIPSWidget)

declare global {
    interface HTMLElementTagNameMap {
        'opensips-widget': OpenSIPSWidget
    }
}

export { OpenSIPSWidget }

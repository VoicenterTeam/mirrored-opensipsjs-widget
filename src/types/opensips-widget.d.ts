import type { OpenSIPSWidget } from '@/widget/OpenSIPSWidget'

declare global {
    interface HTMLElementTagNameMap {
        'opensips-widget': OpenSIPSWidget
    }
}

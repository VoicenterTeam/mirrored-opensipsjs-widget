import type { IWidgetTheme } from '@/types/public-api'
import { defaultLogo } from '@/utils/defaultLogo'

export const defaultTheme: IWidgetTheme = {
    colors: {
        primary: '#5E95E8',
        secondary: '#0d8099',
        'main-text': '#414C59',
        'secondary-text': '#8292A5',
        'button-pressed-text': '#FFF',
        'border-lines': '#DDD',
        'primary-bg': '#FFF',
        'secondary-bg': '#F0F2F4',
        'inactive-bg': '#B9C2CC',
        success: '#7CC24F',
        danger: '#EC2A2A',
        'additional-danger-bg': '#F44C4C',
        'additional-success-bg': '#75B8A0',
    },
    layoutConfig: {
        type: 'rounded',
        mode: 'floating',
        position: {
            bottom: '20px',
            anchor: 'bottom-center'
        },
        keypadMode: 'popover',
        keypadPosition: 'bottom'
    },
    images: {
        backgroundLogo: defaultLogo
    }
}

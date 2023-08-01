import type { IWidgetTheme } from '@/types/public-api'

export const defaultTheme: IWidgetTheme = {
    colors: {
        primary: '#5E95E8',
        secondary: '#0d8099',
        'button-pressed-text': '#FFF',
        'primary-bg': '#FFF',
        'secondary-bg': '#F0F2F4',
        'primary-text': '#414C59',
        'secondary-text': '#8292A5',
        'success': '#46B020',
        'danger': '#EC2A2A',
        'border-lines': '#DDD'
    },
    layoutConfig: {
        type: 'rounded',
        mode: 'floating'
    }
}

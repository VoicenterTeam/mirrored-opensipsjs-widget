import { defaultLogo } from '../utils/defaultLogo'

import {
    IWidgetAudioConfig,
    IWidgetTheme,
} from '@/types/public-api'

export const defaultAudioConfig: IWidgetAudioConfig = {
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

export const defaultTheme: IWidgetTheme = {
    colors: {
        primary: '#5E95E8',
        secondary: '#0d8099',
        'main-text': '#414C59',
        'secondary-text': '#8292A5',
        'button-pressed-text': '#FFF',
        'border-lines': '#F3F3F3',
        'primary-bg': '#FFF',
        'secondary-bg': '#F0F2F4',
        'inactive-bg': '#F2F6FF',
        success: '#7CC24F',
        danger: '#EC2A2A',
        'additional-danger-bg': '#F44C4C',
        'additional-success-bg': '#75B8A0',
        'draggable-bg': '#FFF'
    },
    widgetType: 'audio',
    lang: 'en',
    audioConfig: defaultAudioConfig,
    videoConfig: {

    }
}

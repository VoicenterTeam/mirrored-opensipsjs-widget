import { computed, reactive } from 'vue'
import merge from 'lodash/merge'
import {
    TWidgetConfigOptions,
    ICallSettings,
    IWidgetConfig,
    IWidgetTheme,
    TLayoutMode,
    TPosition,
    TKeypadMode,
    TKeypadPosition,
    LangType
} from '@/types/public-api'
import { defaultAudioConfig, defaultTheme } from '@/enum/defaultTheme.enum'
import { getDefaultWidgetConfig } from '@/enum/defaultWidgetConfig.enum'
import { useWidgetDraggable } from '@/composables/useWidgetDraggable'
import { toCssValue } from '@/helpers/cssHelper'
import { cloneDeep } from 'lodash'
import { defaultLogo } from '@/utils/defaultLogo'
import { setLanguage } from '@/plugins/translator'

/* Const */
const POSITION_MODE_MAP: Record<TLayoutMode, string> = {
    floating: 'fixed',
    docked: 'relative',
    fixed: 'fixed'
}

const POSITION_MAP: Record<TPosition, TPosition> = {
    left: 'right',
    right: 'left',
    top: 'bottom',
    bottom: 'top'
}

const CENTER_POSITIONS: Record<string, string> = {
    horizontal: '50vw',
    vertical: '50vh'
}

/* Data */
const widgetConfig = reactive<IWidgetConfig>(getDefaultWidgetConfig())

/* Computed */
export const widgetCallSettings = computed({
    get: () => widgetConfig.callSettings,
    set: (value: ICallSettings) => {
        widgetConfig.callSettings = value
    }
})
export const widgetThemeSettings = computed({
    get: () => widgetConfig.themeSettings,
    set: (value: IWidgetTheme) => {
        widgetConfig.themeSettings = value
    }
})
export const quickCallNumber = computed({
    get: () => widgetCallSettings.value.quickCallNumber,
    set: (value: string) => {
        widgetCallSettings.value.quickCallNumber = value
    }
})
export const allowTransfer = computed({
    get: () => widgetCallSettings.value.allowTransfer,
    set: (value: boolean) => {
        widgetCallSettings.value.allowTransfer = value
    }
})
export const showKeypad = computed({
    get: () => widgetCallSettings.value.showKeypad,
    set: (value: boolean) => {
        widgetCallSettings.value.showKeypad = value
    }
})
export const allowAutoAnswerSetup = computed({
    get: () => widgetCallSettings.value.autoAnswer.allowChange,
    set: (value: boolean) => {
        widgetCallSettings.value.autoAnswer.allowChange = value
    }
})
export const autoAnswerDefaultBehaviour = computed({
    get: () => widgetCallSettings.value.autoAnswer.defaultBehavior,
    set: (value: boolean) => {
        widgetCallSettings.value.autoAnswer.defaultBehavior = value
    }
})
export const allowDNDSetup = computed({
    get: () => widgetCallSettings.value.DND.allowChange,
    set: (value: boolean) => {
        widgetCallSettings.value.DND.allowChange = value
    }
})
export const DNDDefaultBehaviour = computed({
    get: () => widgetCallSettings.value.DND.defaultBehavior,
    set: (value: boolean) => {
        widgetCallSettings.value.DND.defaultBehavior = value
    }
})
export const callWaitingDefaultBehaviour = computed({
    get: () => widgetCallSettings.value.callWaiting,
    set: (value: boolean) => {
        widgetCallSettings.value.callWaiting = value
    }
})
export const allowOutgoingCalls = computed({
    get: () => widgetCallSettings.value.outgoingCalls,
    set: (value: boolean) => {
        widgetCallSettings.value.outgoingCalls = value
    }
})
export const allowMergeCalls = computed({
    get: () => widgetCallSettings.value.mergeCalls,
    set: (value: boolean) => {
        widgetCallSettings.value.mergeCalls = value
    }
})
export const displayCallerInfoName = computed({
    get: () => widgetCallSettings.value.callerInfo.displayName,
    set: (value: boolean) => {
        widgetCallSettings.value.callerInfo.displayName = value
    }
})
export const displayCallerInfoId = computed({
    get: () => widgetCallSettings.value.callerInfo.callerId.display,
    set: (value: boolean) => {
        widgetCallSettings.value.callerInfo.callerId.display = value
    }
})
export const displayCallerInfoIdMask = computed({
    get: () => widgetCallSettings.value.callerInfo.callerId.mask,
    set: (value: boolean) => {
        widgetCallSettings.value.callerInfo.callerId.mask = value
    }
})
export const allowShrinkOnIdle = computed({
    get: () => widgetCallSettings.value.shrinkOnIdle,
    set: (value: boolean) => {
        widgetCallSettings.value.shrinkOnIdle = value
    }
})
export const ringingSoundBase64 = computed({
    get: () => widgetCallSettings.value.ringingSound,
    set: (value: string) => {
        widgetCallSettings.value.ringingSound = value
    }
})

export const language = computed({
    get: () => widgetThemeSettings.value.lang,
    set: (value: LangType) => {
        widgetThemeSettings.value.lang = value
        setLanguage(value)
    }
})

export const bgLogoBase64 = computed({
    get: () => widgetThemeSettings.value.audioConfig?.images.backgroundLogo || defaultLogo,
    set: (value: string | undefined) => {
        if (widgetThemeSettings.value.audioConfig) {
            widgetThemeSettings.value.audioConfig.images.backgroundLogo = value
        }
    }
})

export const keypadMode = computed({
    get: () => widgetThemeSettings.value.audioConfig?.layoutConfig.keypadMode,
    set: (value: TKeypadMode) => {
        if (widgetThemeSettings.value.audioConfig) {
            widgetThemeSettings.value.audioConfig.layoutConfig.keypadMode = value
        }
    }
})

export const keypadPosition = computed({
    get: () => widgetThemeSettings.value.audioConfig?.layoutConfig.keypadPosition,
    set: (value: TKeypadPosition) => {
        if (widgetThemeSettings.value.audioConfig) {
            widgetThemeSettings.value.audioConfig.layoutConfig.keypadPosition = value
        }
    }
})

export const outgoingCallInputPlaceholder = computed({
    get: () => widgetCallSettings.value.outgoingCallPlaceHolder,
    set: (value: string) => {
        widgetCallSettings.value.outgoingCallPlaceHolder = value
    }
})
export const outgoingInputRegexValidator = computed({
    get: () => widgetCallSettings.value.outgoingInputRegexValidator,
    set: (value: Array<string>) => {
        widgetCallSettings.value.outgoingInputRegexValidator = value
    }
})

export const widgetType = computed(() => widgetThemeSettings.value.widgetType)

export const layoutType = computed(() => widgetThemeSettings.value.audioConfig?.layoutConfig.type || defaultAudioConfig.layoutConfig.type)

export const layoutMode = computed(() => widgetThemeSettings.value.audioConfig?.layoutConfig.mode || defaultAudioConfig.layoutConfig.mode)

export const showDraggableHandle = computed(() => layoutMode.value === 'floating')

/* Methods */
export function setCallSettingsPermissions (settings: Partial<ICallSettings>) {
    widgetCallSettings.value = merge({}, widgetCallSettings.value, settings)
}

/*function buildPositionSettings (settings: IWidgetTheme) {
    const position: Partial<TPositionConfig> = {}

    for (const [ key, oppositeKey ] of Object.entries(POSITION_MAP) as [ TPosition, TPosition ][]) {
        const value = settings.audioConfig?.layoutConfig?.position[key]

        if (value !== undefined) {
            position[key] = toCssValue(value, 'unset')

            if (!settings.audioConfig?.layoutConfig?.position[oppositeKey]) {
                position[oppositeKey] = 'unset'
            }
        }
    }

    if (settings.audioConfig?.layoutConfig?.mode === 'floating') {
        position.right = 'unset'
        position.bottom = 'unset'
    } else {
        const anchor = position.anchor = settings.audioConfig?.layoutConfig?.position.anchor

        if (anchor) {
            position.left = CENTER_POSITIONS.horizontal
            position.right = 'unset'

            switch (anchor) {
                case 'bottom-center':
                    position.bottom = toCssValue(settings.audioConfig?.layoutConfig?.position.bottom, '0px')
                    position.top = 'unset'

                    break
                case 'top-center':
                    position.bottom = 'unset'
                    position.top = toCssValue(settings.audioConfig?.layoutConfig?.position.top, '0px')

                    break
                case 'center':
                    position.bottom = 'unset'
                    position.top = CENTER_POSITIONS.vertical

                    break
            }
        }
    }

    return position
}*/

export function applySettingsToWidgetRootEl (widgetRootEl: HTMLElement, dragHandleElement?: HTMLElement) {
    const settings = widgetThemeSettings.value

    // Setting widget colors
    Object.entries(settings.colors).forEach(([ key, value ]) => {
        widgetRootEl.style.setProperty(`--${key}`, value)
    })

    const widgetMode = settings.audioConfig?.layoutConfig.mode
    widgetRootEl.style.position = widgetMode && POSITION_MODE_MAP[widgetMode] ? POSITION_MODE_MAP[widgetMode] : 'unset'

    for (const [ key, oppositeKey ] of Object.entries(POSITION_MAP) as [ TPosition, TPosition ][]) {
        const value = settings.audioConfig?.layoutConfig.position[key]

        if (value !== undefined) {
            widgetRootEl.style[key] = toCssValue(value, 'unset')

            if (!settings.audioConfig?.layoutConfig.position[oppositeKey]) {
                widgetRootEl.style[oppositeKey] = 'unset'
            }
        }
    }

    const { enableDraggable, disableDraggable } = useWidgetDraggable()

    if (settings.audioConfig?.layoutConfig.mode === 'floating') {
        widgetRootEl.style.right = 'unset'
        widgetRootEl.style.bottom = 'unset'

        if (dragHandleElement) {
            enableDraggable(dragHandleElement, widgetRootEl)
        }
    } else {
        const anchor = settings.audioConfig?.layoutConfig.position.anchor

        if (anchor) {
            widgetRootEl.style.left = CENTER_POSITIONS.horizontal
            widgetRootEl.style.right = 'unset'

            switch (anchor) {
                case 'bottom-center':
                    widgetRootEl.style.bottom = toCssValue(settings.audioConfig?.layoutConfig.position.bottom, '0px')
                    widgetRootEl.style.top = 'unset'
                    widgetRootEl.style.transform = 'translateX(-50%)'

                    break
                case 'top-center':
                    widgetRootEl.style.bottom = 'unset'
                    widgetRootEl.style.top = toCssValue(settings.audioConfig?.layoutConfig.position.top, '0px')
                    widgetRootEl.style.transform = 'translateX(-50%)'

                    break
                case 'center':
                    widgetRootEl.style.bottom = 'unset'
                    widgetRootEl.style.top = CENTER_POSITIONS.vertical
                    widgetRootEl.style.transform = 'translate(-50%, -50%)'

                    break
            }
        }

        disableDraggable()
    }
}

export function setThemeSettings (settings: Partial<IWidgetTheme>) {
    const mergedTheme: IWidgetTheme = merge({}, defaultTheme, settings)

    widgetThemeSettings.value = {
        ...mergedTheme,
        //position: buildPositionSettings(mergedTheme)
    }

    setLanguage(widgetThemeSettings.value.lang)
}

export function setConfig (config: Partial<TWidgetConfigOptions>) {
    setCallSettingsPermissions(config.callSettings ?? {})
    setThemeSettings(config.themeSettings ?? {})
}

export function getConfig (): IWidgetConfig {
    return cloneDeep(widgetConfig)
}


export function setRingingSound (base64: string) {
    ringingSoundBase64.value = base64
}

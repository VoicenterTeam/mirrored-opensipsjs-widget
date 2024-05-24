import { computed, ref } from 'vue'
import merge from 'lodash/merge'
import type {
    TWidgetConfigOptions,
    ICallSettings,
    IWidgetConfig,
    IWidgetTheme,
    TLayoutMode,
    TPosition,
    TKeypadMode,
    TKeypadPosition
} from '@/types/public-api'
import { defaultTheme } from '@/enum/defaultTheme.enum'
import { useWidgetState } from '@/composables/useWidgetState'
import { getDefaultWidgetConfig } from '@/enum/defaultWidgetConfig.enum'
import { useWidgetDraggable } from '@/composables/useWidgetDraggable'
import { toCssValue } from '@/helpers/cssHelper'
import { cloneDeep } from 'lodash'
import { defaultLogo } from '@/utils/defaultLogo'

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
const widgetConfig = ref<IWidgetConfig>(getDefaultWidgetConfig())

/* Computed */
export const widgetCallSettings = computed({
    get: () => widgetConfig.value.callSettings,
    set: (value: ICallSettings) => {
        widgetConfig.value = {
            ...widgetConfig.value,
            callSettings: value
        }
    }
})
export const widgetThemeSettings = computed({
    get: () => widgetConfig.value.themeSettings,
    set: (value: IWidgetTheme) => {
        widgetConfig.value = {
            ...widgetConfig.value,
            themeSettings: value
        }
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
export const allowOutgoingCalls = computed({
    get: () => widgetCallSettings.value.outgoingCalls,
    set: (value: boolean) => {
        widgetCallSettings.value.outgoingCalls = value
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
export const bgLogoBase64 = computed({
    get: () => widgetThemeSettings.value.images.backgroundLogo || defaultLogo,
    set: (value: string | undefined) => {
        widgetThemeSettings.value.images.backgroundLogo = value
    }
})

export const keypadMode = computed({
    get: () => widgetThemeSettings.value.layoutConfig.keypadMode,
    set: (value: TKeypadMode) => {
        widgetThemeSettings.value.layoutConfig.keypadMode = value
    }
})

export const keypadPosition = computed({
    get: () => widgetThemeSettings.value.layoutConfig.keypadPosition,
    set: (value: TKeypadPosition) => {
        widgetThemeSettings.value.layoutConfig.keypadPosition = value
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
export const layoutType = computed(() => widgetThemeSettings.value.layoutConfig.type)

export const layoutMode = computed(() => widgetThemeSettings.value.layoutConfig.mode)

/* Methods */
export function setCallSettingsPermissions (settings: Partial<ICallSettings>) {
    widgetCallSettings.value = merge(widgetCallSettings.value, settings)
}

function setWidgetPosition (settings: IWidgetTheme, widgetRootEl: HTMLElement) {
    widgetRootEl.style.position = POSITION_MODE_MAP[settings.layoutConfig.mode] || 'unset'

    for (const [ key, oppositeKey ] of Object.entries(POSITION_MAP) as [ TPosition, TPosition ][]) {
        const value = settings.layoutConfig.position[key]

        if (value !== undefined) {
            widgetThemeSettings.value.layoutConfig.position[key] = widgetRootEl.style[key] = toCssValue(value, 'unset')

            if (!settings.layoutConfig.position[oppositeKey]) {
                widgetThemeSettings.value.layoutConfig.position[oppositeKey] = widgetRootEl.style[oppositeKey] = 'unset'
            }
        }
    }

    if (settings.layoutConfig.mode === 'floating') {
        widgetThemeSettings.value.layoutConfig.position.right = widgetRootEl.style.right = 'unset'
        widgetThemeSettings.value.layoutConfig.position.bottom = widgetRootEl.style.bottom = 'unset'
    } else {
        const anchor = widgetThemeSettings.value.layoutConfig.position.anchor = settings.layoutConfig.position.anchor

        if (anchor) {
            widgetThemeSettings.value.layoutConfig.position.left = widgetRootEl.style.left = CENTER_POSITIONS.horizontal
            widgetThemeSettings.value.layoutConfig.position.right = widgetRootEl.style.right = 'unset'

            switch (anchor) {
                case 'bottom-center':
                    widgetThemeSettings.value.layoutConfig.position.bottom = widgetRootEl.style.bottom = toCssValue(settings.layoutConfig.position.bottom, '0px')
                    widgetThemeSettings.value.layoutConfig.position.top = widgetRootEl.style.top = 'unset'
                    widgetRootEl.style.transform = 'translateX(-50%)'

                    break
                case 'top-center':
                    widgetThemeSettings.value.layoutConfig.position.bottom = widgetRootEl.style.bottom = 'unset'
                    widgetThemeSettings.value.layoutConfig.position.top = widgetRootEl.style.top = toCssValue(settings.layoutConfig.position.top, '0px')
                    widgetRootEl.style.transform = 'translateX(-50%)'

                    break
                case 'center':
                    widgetThemeSettings.value.layoutConfig.position.bottom = widgetRootEl.style.bottom = 'unset'
                    widgetThemeSettings.value.layoutConfig.position.top = widgetRootEl.style.top = CENTER_POSITIONS.vertical
                    widgetRootEl.style.transform = 'translate(-50%, -50%)'

                    break
            }
        }
    }
}

export function setThemeSettings (settings: Partial<IWidgetTheme>, widgetRootEl: HTMLElement) {
    const mergedTheme: IWidgetTheme = merge(defaultTheme, settings)

    widgetThemeSettings.value = mergedTheme

    // Setting widget colors
    Object.entries(mergedTheme.colors).forEach(([ key, value ]) => {
        widgetRootEl.style.setProperty(`--${key}`, value)
    })

    // Setting widget position
    setWidgetPosition(mergedTheme, widgetRootEl)
}

export function setConfig (config: Partial<TWidgetConfigOptions>) {
    const { widgetElement, dragHandleElement } = useWidgetState()
    const { enableDraggable, disableDraggable } = useWidgetDraggable()

    setCallSettingsPermissions(config.callSettings ?? {})
    setThemeSettings(config.themeSettings ?? {}, widgetElement)

    if (widgetThemeSettings.value.layoutConfig.mode === 'floating') {
        enableDraggable(dragHandleElement, widgetElement)
    } else {
        disableDraggable()
    }
}

export function getConfig (): IWidgetConfig {
    return cloneDeep(widgetConfig.value)
}


export function setRingingSound (base64: string) {
    ringingSoundBase64.value = base64
}

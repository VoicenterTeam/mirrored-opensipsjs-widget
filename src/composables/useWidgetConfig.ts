import { computed, ref } from 'vue'
import merge from 'lodash/merge'
import type { ICallSettings } from '@/types/internal'
import type { TWidgetConfigOptions, IWidgetTheme, IWidgetConfig } from '@/types/public-api'
import { defaultTheme } from '@/enum/defaultTheme.enum'
import { useWidgetState } from '@/composables/useWidgetState'
import { getDefaultWidgetConfig } from '@/enum/defaultWidgetConfig.enum'
import { useWidgetDraggable } from '@/composables/useWidgetDraggable'

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
export const allowTransfer = computed({
    get: () => widgetCallSettings.value.allowTransfer,
    set: (value: boolean) => {
        widgetCallSettings.value.allowTransfer = value
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
export const layoutMode = computed(() => widgetThemeSettings.value.layoutConfig.mode)

export function setCallSettingsPermissions (settings: Partial<ICallSettings>) {
    const mergedSettings: ICallSettings = merge(widgetCallSettings.value, settings)

    widgetCallSettings.value = mergedSettings
}

export function setColorThemeSettings (settings: Partial<IWidgetTheme>, widgetRootEl: HTMLElement) {
    const mergedTheme: IWidgetTheme = merge(defaultTheme, settings)

    widgetThemeSettings.value = mergedTheme

    Object.entries(mergedTheme.colors).forEach(([ key, value ]) => {
        widgetRootEl.style.setProperty(`--${key}`, value)
    })
}

export function setConfig (config: Partial<TWidgetConfigOptions>) {
    const { widgetElement, dragHandleElement } = useWidgetState()
    const { enableDraggable, disableDraggable } = useWidgetDraggable()

    setCallSettingsPermissions(config.callSettings ?? {})
    setColorThemeSettings(config.themeSettings ?? {}, widgetElement)

    if (widgetThemeSettings.value.layoutConfig.mode === 'floating') {
        enableDraggable(dragHandleElement, widgetElement)
    } else {
        disableDraggable()
    }
}

export function setRingingSound (base64: string) {
    ringingSoundBase64.value = base64
}

import { ref } from 'vue'
import merge from 'lodash/merge'
import type { ICallSettings } from '@/types/internal'
import type { IWidgetConfigOptions, IWidgetTheme } from '@/types/public-api'
import { defaultTheme } from '@/enum/defaultTheme.enum'

const defaultCallSettings: ICallSettings = {
    allowTransfer: true,
    autoAnswer: {
        allowChange: false,
        defaultBehavior: false
    },
    outgoingCalls: false,
    callerInfo: {
        displayName: true,
        callerId: {
            display: true,
            mask: false
        }
    },
    shrinkOnIdle: false
}

export const allowTransfer = ref<boolean>(defaultCallSettings.allowTransfer)
export const allowAutoAnswerSetup = ref<boolean>(defaultCallSettings.autoAnswer.allowChange)
export const autoAnswerDefaultBehaviour = ref<boolean>(defaultCallSettings.autoAnswer.defaultBehavior)
export const allowOutgoingCalls = ref<boolean>(defaultCallSettings.outgoingCalls)
export const displayCallerInfoName = ref<boolean>(defaultCallSettings.callerInfo.displayName)
export const displayCallerInfoId = ref<boolean>(defaultCallSettings.callerInfo.callerId.display)
export const displayCallerInfoIdMask = ref<boolean>(defaultCallSettings.callerInfo.callerId.mask)
export const allowShrinkOnIdle = ref<boolean>(defaultCallSettings.shrinkOnIdle)

export function setCallSettingsPermissions (settings: Partial<ICallSettings>) {
    const mergedSettings: ICallSettings = merge(defaultCallSettings, settings)

    allowTransfer.value = mergedSettings.allowTransfer
    allowAutoAnswerSetup.value = mergedSettings.autoAnswer.allowChange
    autoAnswerDefaultBehaviour.value = mergedSettings.autoAnswer.defaultBehavior
    allowOutgoingCalls.value = mergedSettings.outgoingCalls
    displayCallerInfoName.value = mergedSettings.callerInfo.displayName
    displayCallerInfoId.value = mergedSettings.callerInfo.callerId.display
    displayCallerInfoIdMask.value = mergedSettings.callerInfo.callerId.mask
    allowShrinkOnIdle.value = mergedSettings.shrinkOnIdle
}

export function setColorThemeSettings (settings: Partial<IWidgetTheme>, widgetRootEl: HTMLElement) {
    const mergedTheme: IWidgetTheme = merge(defaultTheme, settings)

    Object.entries(mergedTheme.colors).forEach(([ key, value ]) => {
        widgetRootEl.style.setProperty(`--${key}`, value)
    })
}

export function setConfig (config: Partial<IWidgetConfigOptions>, widgetRootEl: HTMLElement) {
    setCallSettingsPermissions(config.callSettings ?? {})
    setColorThemeSettings(config.themeSettings ?? {}, widgetRootEl)
}

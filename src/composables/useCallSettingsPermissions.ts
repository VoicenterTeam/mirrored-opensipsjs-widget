import { ref } from 'vue'
import merge from 'lodash/merge'
import type { ICallSettings } from '@/types/internal'
import type { IWidgetTheme } from '@/types/public-api'
import { defaultTheme } from '@/enum/defaultTheme.enum'
import { defaultRingingSound } from '@/utils/ringingSound'

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
            mask: true
        }
    },
    shrinkOnIdle: false,
    ringingSound: defaultRingingSound
}

export const allowTransfer = ref<boolean>(defaultCallSettings.allowTransfer)
export const allowAutoAnswerSetup = ref<boolean>(defaultCallSettings.autoAnswer.allowChange)
export const autoAnswerDefaultBehaviour = ref<boolean>(defaultCallSettings.autoAnswer.defaultBehavior)
export const allowOutgoingCalls = ref<boolean>(defaultCallSettings.outgoingCalls)
export const displayCallerInfoName = ref<boolean>(defaultCallSettings.callerInfo.displayName)
export const displayCallerInfoId = ref<boolean>(defaultCallSettings.callerInfo.callerId.display)
export const displayCallerInfoIdMask = ref<boolean>(defaultCallSettings.callerInfo.callerId.mask)
export const allowShrinkOnIdle = ref<boolean>(defaultCallSettings.shrinkOnIdle)
export const ringingSoundBase64 = ref<string>(defaultCallSettings.ringingSound)

export function setCallSettingsPermissions (settings: ICallSettings) {
    allowTransfer.value = settings.allowTransfer
    allowAutoAnswerSetup.value = settings.autoAnswer.allowChange
    autoAnswerDefaultBehaviour.value = settings.autoAnswer.defaultBehavior
    allowOutgoingCalls.value = settings.outgoingCalls
    displayCallerInfoName.value = settings.callerInfo.displayName
    displayCallerInfoId.value = settings.callerInfo.callerId.display
    displayCallerInfoIdMask.value = settings.callerInfo.callerId.mask
    allowShrinkOnIdle.value = settings.shrinkOnIdle

    if (settings.ringingSound) {
        ringingSoundBase64.value = settings.ringingSound
    }
}

export function setColorThemeSettings (settings: IWidgetTheme) {
    const widgetRootEl = document.querySelector('#openSIPSWidget') as HTMLElement

    if (!widgetRootEl) {
        throw new Error('Widget root element is not found!')
    }

    const mergedTheme = merge(defaultTheme, settings)

    Object.entries(mergedTheme.colors).forEach(([ key, value ]) => {
        widgetRootEl.style.setProperty(`--${key}`, value)
    })

}

export function setRingingSound (base64: string) {
    ringingSoundBase64.value = base64
}

import { ref } from 'vue'
import type { ICallSettings } from '@/types/internal'
import type { IWidgetTheme } from '@/types/public-api'

const defaultCallSettings: ICallSettings = {
    allowTransfer: true,
    autoAnswer: {
        allowChange: false,
        defaultBehavior: true
    },
    outgoingCalls: false,
    callerInfo: {
        displayName: true,
        callerId: {
            display: true,
            mask: true
        }
    }
}

export const allowTransfer = ref<boolean>(defaultCallSettings.allowTransfer)
export const allowAutoAnswerSetup = ref<boolean>(defaultCallSettings.autoAnswer.allowChange)
export const autoAnswerDefaultBehaviour = ref<boolean>(defaultCallSettings.autoAnswer.defaultBehavior)
export const allowOutgoingCalls = ref<boolean>(defaultCallSettings.outgoingCalls)
export const displayCallerInfoName = ref<boolean>(defaultCallSettings.callerInfo.displayName)
export const displayCallerInfoId = ref<boolean>(defaultCallSettings.callerInfo.callerId.display)
export const displayCallerInfoIdMask = ref<boolean>(defaultCallSettings.callerInfo.callerId.mask)

export function setCallSettingsPermissions (settings: ICallSettings) {
    allowTransfer.value = settings.allowTransfer
    allowAutoAnswerSetup.value = settings.autoAnswer.allowChange
    autoAnswerDefaultBehaviour.value = settings.autoAnswer.defaultBehavior
    allowOutgoingCalls.value = settings.outgoingCalls
    displayCallerInfoName.value = settings.callerInfo.displayName
    displayCallerInfoId.value = settings.callerInfo.callerId.display
    displayCallerInfoIdMask.value = settings.callerInfo.callerId.mask
}

export function setColorThemeSettings (settings: IWidgetTheme) {
    const widgetRootEl = document.querySelector('#openSIPSWidget') as HTMLElement

    if (!widgetRootEl) {
        throw new Error('Widget root element is not found!')
    }

    widgetRootEl.style.setProperty('--primary', settings.colors.primary)
    widgetRootEl.style.setProperty('--secondary', settings.colors.secondary)
    widgetRootEl.style.setProperty('--primary-bg', settings.colors['primary-bg'])
    widgetRootEl.style.setProperty('--secondary-bg', settings.colors['secondary-bg'])
    widgetRootEl.style.setProperty('--border-lines', settings.colors['border-lines'])
    widgetRootEl.style.setProperty('--secondary', settings.colors.secondary)

}
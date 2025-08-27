import { ICall } from 'opensips-js-vue'
import { useDisplayResolvers } from '@/composables/useDisplayResolvers.ts'
import { displayCallerInfoIdMask } from '@/composables/useWidgetConfig.ts'
import { getTranslation } from '@/plugins/translator.ts'
import { CallerInfoResolved } from '@/types/public-api'

/**
 * Returns the caller number extracted from SIP URI
 *
 * @param call
 * @param useMask - whether to mask the number (show only last digit)
 */
export function getCallerNumber (call: ICall, useMask = false): string {
    const number = call._remote_identity._uri._user
    const hasPlus = number[0] === '+'
    const onlyNumber = hasPlus ? number.slice(1) : number

    if (useMask) {
        let countryCode = ''
        let mainNumber = onlyNumber

        if (onlyNumber.length > 10) {
            countryCode = onlyNumber.slice(0, onlyNumber.length - 10)
            mainNumber = onlyNumber.slice(onlyNumber.length - 10)
        }

        const lastDigit = mainNumber[mainNumber.length - 1]
        const maskedMainNumber = 'X'.repeat(mainNumber.length - 1)

        return `${countryCode}${maskedMainNumber}${lastDigit}`
    } else {
        return number
    }
}

/**
 * Returns the caller name
 * Compares the extracted name and number from remote identity, and if equal - returns the number based on the mask setting
 *
 * @param call
 * @param useMask
 */
export function getCallerName (call: ICall, useMask = false): string {
    const rawCNumber = getCallerNumber(call)
    const cName = call._remote_identity._display_name

    if (cName === rawCNumber) {
        return getCallerNumber(call, useMask)
    }

    return cName
}

/**
 * Resolves the call display info (name and number) using the registered callerInfo resolver
 * Falls back to the masked/unmasked caller name/number or "Unknown" if no resolver is registered or resolution fails
 *
 * @param call
 */
export async function getCallDisplayInfo (call: ICall): Promise<{ displayName: string, displayNumber: string }> {
    const { getResolver } = useDisplayResolvers()

    const unmaskedPhoneNumber = getCallerNumber(call)
    const unmaskedUserName = getCallerName(call)

    const maskedPhoneNumber = getCallerNumber(call, displayCallerInfoIdMask.value)
    const maskedUserName = getCallerName(call, displayCallerInfoIdMask.value)

    const callerInfoResolver = getResolver('callerInfo')
    const fallbackDisplayName = maskedUserName || maskedPhoneNumber || getTranslation('audio.unknown')

    const fallbackDisplayInfo = {
        displayName: fallbackDisplayName,
        displayNumber: maskedPhoneNumber
    }

    if (!callerInfoResolver) {
        return fallbackDisplayInfo
    }

    let resolved: CallerInfoResolved | null | undefined

    try {
        resolved = await callerInfoResolver(
            call,
            {
                userName: unmaskedUserName,
                userPhone: unmaskedPhoneNumber
            }
        )
    } catch (e) {
        resolved = null
    }

    if (resolved) {
        return {
            displayName: resolved.name,
            displayNumber: resolved.number
        }
    }

    return fallbackDisplayInfo
}


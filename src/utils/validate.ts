import { parseJSON } from '@/utils/parseJSON'
import { defaultTheme } from '@/enum/defaultTheme.enum'
import type { ISIPSCredentials, IWidgetTheme } from '@/types/main'

export function validateCredentials (credentials: unknown): credentials is ISIPSCredentials {
    if (typeof credentials !== 'object' || credentials === null) {
        return false
    }

    const creds = credentials as { [key: string]: unknown } // This will allow property access

    return (
        typeof creds.domain === 'string' &&
        typeof creds.username === 'string' &&
        typeof creds.password === 'string'
    )
}

export function parseAndValidateCredentials (credentials: string | undefined): ISIPSCredentials | null {
    const parsed = parseJSON(credentials)

    return validateCredentials(parsed) ? parsed : null
}

export function validateTheme (theme: unknown): theme is IWidgetTheme {
    if (typeof theme !== 'object' || theme === null) {
        return false
    }

    const themeObj = theme as { [key: string]: unknown }

    return typeof themeObj.color === 'string'
}

export function parseAndValidateTheme (theme: string | undefined): IWidgetTheme {
    const parsed = parseJSON(theme)

    if (validateTheme(parsed)) {
        return parsed
    }

    return defaultTheme
}

import { parseJSON } from '@/utils/parseJSON'
import { defaultTheme } from '@/enum/defaultTheme.enum'
import type { IWidgetTheme } from '@/types/public-api'

export function validateTheme (theme: unknown): theme is IWidgetTheme {
    if (typeof theme !== 'object' || theme === null) {
        return false
    }

    const themeObj = theme as { [key: string]: unknown }

    return typeof themeObj.color === 'string'
}

export function getThemeWithDefaults (theme: string | undefined): IWidgetTheme {
    const parsed = parseJSON(theme)

    if (!validateTheme(parsed)) {
        return defaultTheme
    }

    return {
        ...defaultTheme,
        ...parsed
    }
}

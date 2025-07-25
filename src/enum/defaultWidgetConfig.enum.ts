import type { IWidgetConfig } from '@/types/public-api'
import { defaultTheme } from '@/enum/defaultTheme.enum'
import { defaultCallSettings } from '@/enum/defaultCallSettings.enum'

export function getDefaultWidgetConfig (): IWidgetConfig {
    return JSON.parse(JSON.stringify({
        callSettings: defaultCallSettings,
        themeSettings: defaultTheme
    }))
}
